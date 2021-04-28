const bitboxSDK = require('bitbox-sdk').BITBOX;
const BITBOX = new bitboxSDK();

// Set NETWORK to either testnet or mainnet
const NETWORK = `mainnet`;

// Instantiate BITBOX based on the network.
const bitbox =
    NETWORK === `mainnet`
        ? new bitboxSDK({ restURL: `https://rest.bitcoin.com/v2/` })
        : new bitboxSDK({ restURL: `https://trest.bitcoin.com/v2/` });

// TODO: Add send-all func
// https://github.com/Bitcoin-com/bitbox-sdk/blob/master/examples/applications/wallet/send-all/send-all.js
class Wallet {
    static async createWallet() {
        const lang = 'english'; // Set the language of the wallet.

        // These objects used for writing wallet information out to a file.
        let outStr = '';
        const outObj = {};

        // create 256 bit BIP39 mnemonic
        const mnemonic = bitbox.Mnemonic.generate(128, bitbox.Mnemonic.wordLists()[lang]);

        console.log('BIP44 $BCH Wallet');
        outStr += 'BIP44 $BCH Wallet\n';
        console.log(`128 bit ${lang} BIP39 Mnemonic: `, mnemonic);
        outStr += `\n128 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
        outObj.mnemonic = mnemonic;

        // root seed buffer
        const rootSeed = bitbox.Mnemonic.toSeed(mnemonic);

        // master HDNode
        const masterHDNode = bitbox.HDNode.fromSeed(rootSeed, NETWORK);

        // HDNode of BIP44 account
        console.log(`BIP44 Account: "m/44'/145'/0'"`);
        outStr += `BIP44 Account: "m/44'/145'/0'"\n`;

        // Generate the first 10 seed addresses.
        for (let i = 0; i < 10; i++) {
            const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
            console.log(`m/44'/145'/0'/0/${i}: ${bitbox.HDNode.toCashAddress(childNode)}`);
            outStr += `m/44'/145'/0'/0/${i}: ${bitbox.HDNode.toCashAddress(childNode)}\n`;

            // Save the first seed address for use in the .json output file.
            if (i === 0) {
                outObj.cashAddress = bitbox.HDNode.toCashAddress(childNode);
                outObj.legacyAddress = bitbox.HDNode.toLegacyAddress(childNode);
                outObj.WIF = bitbox.HDNode.toWIF(childNode);
            }
        }
        return outObj;
    }

    async sendBch(RECV_ADDR, SEND_ADDR, SEND_MNEMONIC, SATOSHIS_TO_SEND) {
        try {
            // Send the money back to yourself if the users hasn't specified a destination.
            if (RECV_ADDR === '') RECV_ADDR = SEND_ADDR;

            // Get the balance of the sending address.
            const balance = await this.getBCHBalance(SEND_ADDR, false);
            console.log(
                `sendBch:: started sending ${SATOSHIS_TO_SEND} BCHSatoshi FROM ${SEND_ADDR} TO ${RECV_ADDR}`
            );
            console.log(`Balance of (FROM) sending address ${SEND_ADDR} is ${balance} BCH.`);

            // Exit if the balance is zero.
            if (balance <= 0.0) {
                return 401;
            } else if (BITBOX.BitcoinCash.toSatoshi(balance) < SATOSHIS_TO_SEND) {
                return 401;
            }

            const balance2 = await this.getBCHBalance(RECV_ADDR, false);
            console.log(`Balance of (TO) receiving address ${RECV_ADDR} is ${balance2} BCH.`);

            const u = await bitbox.Address.utxo(SEND_ADDR);
            const utxo = this.findBiggestUtxo(u.utxos);
            console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

            const transactionBuilder = new bitbox.TransactionBuilder(NETWORK);

            let satoshisToSend = SATOSHIS_TO_SEND;
            const originalAmount = utxo.satoshis;
            const vout = utxo.vout;
            const txid = utxo.txid;
            if (originalAmount < satoshisToSend) {
                satoshisToSend = originalAmount;
            }

            // add input with txid and index of vout
            transactionBuilder.addInput(txid, vout);

            // get byte count to calculate fee. paying 1.2 sat/byte
            const byteCount = bitbox.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 2 });
            console.log(`byteCount: ${byteCount}`);
            const satoshisPerByte = 1.0;
            const txFee = Math.floor(satoshisPerByte * byteCount);
            console.log(`txFee: ${txFee} BCHSatoshi`);

            // amount to send back to the sending address.
            // It's the original amount - 1 sat/byte for tx size
            const remainder = originalAmount - satoshisToSend - txFee;
            const outSatoshis = satoshisToSend - txFee;
            // add output w/ address and amount to send

            transactionBuilder.addOutput(RECV_ADDR, outSatoshis);
            console.log('rec addre satoshis', outSatoshis);
            if (remainder > 0) {
                transactionBuilder.addOutput(SEND_ADDR, remainder);
            }
            console.log('send addre remainder', remainder);

            // Generate a change address from a Mnemonic of a private key.
            const change = this.changeAddrFromMnemonic(SEND_MNEMONIC);

            // Generate a keypair from the change address.
            const keyPair = bitbox.HDNode.toKeyPair(change);

            // Sign the transaction with the HD node.
            let redeemScript;
            transactionBuilder.sign(
                0,
                keyPair,
                redeemScript,
                transactionBuilder.hashTypes.SIGHASH_ALL,
                originalAmount
            );

            // build tx
            const tx = transactionBuilder.build();
            // output rawhex
            const hex = tx.toHex();
            console.log(`TX hex: ${hex}`);
            console.log();
            // Broadcast transation to the network
            const txidStr = await bitbox.RawTransactions.sendRawTransaction([hex]);
            console.log(`Transaction ID: ${txidStr}`);
            console.log(`Check the status of your transaction on this block explorer:`);
            console.log(`https://explorer.bitcoin.com/tbch/tx/${txidStr}`);
            return txidStr;
        } catch (err) {
            console.log(`error: `, err);
            return 402;
        }
    }

    async sendAll(RECV_ADDR, SEND_ADDR, SEND_MNEMONIC) {
        try {
            // Send the money back to yourself if the users hasn't specified a destination.
            if (RECV_ADDR === '') RECV_ADDR = SEND_ADDR;

            const transactionBuilder = new bitbox.TransactionBuilder(NETWORK);

            let sendAmount = 0;
            const inputs = [];

            const u = await bitbox.Address.utxo(SEND_ADDR);

            // Loop through each UTXO assigned to this address.
            u.utxos.forEach(utxo => {
                inputs.push(utxo);
                sendAmount += utxo.satoshis;
                transactionBuilder.addInput(utxo.txid, utxo.vout);
            });

            // get byte count to calculate fee. paying 1.0 sat/byte
            const byteCount = bitbox.BitcoinCash.getByteCount(
                { P2PKH: inputs.length },
                { P2PKH: 1 }
            );
            console.log(`byteCount: ${byteCount}`);

            const satoshisPerByte = 1.0;
            const txFee = Math.ceil(satoshisPerByte * byteCount);
            console.log(`txFee: ${txFee}`);

            // Exit if the transaction costs too much to send.
            if (sendAmount - txFee < 0) {
                console.log(`Transaction fee costs more combined UTXOs. Can't send transaction.`);
                process.exit(1);
            }

            // add output w/ address and amount to send
            transactionBuilder.addOutput(RECV_ADDR, sendAmount - txFee);

            // Generate a change address from a Mnemonic of a private key.
            const change = this.changeAddrFromMnemonic(SEND_MNEMONIC);

            // Generate a keypair from the change address.
            const keyPair = bitbox.HDNode.toKeyPair(change);

            // sign w/ HDNode
            let redeemScript;
            inputs.forEach((input, index) => {
                transactionBuilder.sign(
                    index,
                    keyPair,
                    redeemScript,
                    transactionBuilder.hashTypes.SIGHASH_ALL,
                    input.satoshis
                );
            });

            // build tx
            const tx = transactionBuilder.build();

            // output rawhex
            const hex = tx.toHex();
            console.log(`TX hex: ${hex}`);
            console.log();

            // Broadcast transation to the network
            const txid = await bitbox.RawTransactions.sendRawTransaction([hex]);
            console.log(`Transaction ID: ${txid}`);
            console.log(`Check the status of your transaction on this block explorer:`);
            console.log(`https://explorer.bitcoin.com/tbch/tx/${txid}`);
        } catch (err) {
            console.log(`error: `, err);
            return 402;
        }
    }

    // Generate a change address from a Mnemonic of a private key.
    changeAddrFromMnemonic(mnemonic, network) {
        const rootSeed = bitbox.Mnemonic.toSeed(mnemonic);
        const masterHDNode = bitbox.HDNode.fromSeed(rootSeed, network);
        const account = bitbox.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

        // derive the first external change address HDNode which is going to spend utxo
        const change = bitbox.HDNode.derivePath(account, '0/0');
        return change;
    }

    // Get the balance in BCH of a BCH address.
    async getBCHBalance(addr, verbose) {
        try {
            const bchBalance = await bitbox.Address.details(addr);

            if (verbose) console.log(bchBalance);

            return bchBalance.balance;
        } catch (err) {
            console.error(`Error in getBCHBalance: `, err);
            console.log(`addr: ${addr}`);
            throw err;
        }
    }

    // Get address details
    async getAddressDetails(addr, verbose) {
        try {
            const details = await bitbox.Address.details(addr);

            if (verbose) console.log(details);

            return details;
        } catch (err) {
            console.error(`Error in getAddressDetails: `, err);
            console.log(`addr: ${addr}`);
            throw err;
        }
    }

    // Get transaction data
    static async getTransaction(tx) {
        try {
            let details = await bitbox.Transaction.details(tx);
            return details;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // Returns the utxo with the biggest balance from an array of utxos.

    findBiggestUtxo(utxos) {
        let largestAmount = 0;
        let largestIndex = 0;

        for (let i = 0; i < utxos.length; i++) {
            const thisUtxo = utxos[i];

            if (thisUtxo.satoshis > largestAmount) {
                largestAmount = thisUtxo.satoshis;
                largestIndex = i;
            }
        }

        return utxos[largestIndex];
    }
}
module.exports = Wallet;
