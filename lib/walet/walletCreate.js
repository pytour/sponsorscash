const bitboxSDK = require("bitbox-sdk").BITBOX;
const BITBOX = new bitboxSDK();

const NETWORK = `mainnet`;


const bitbox =
  NETWORK === `mainnet`
    ? new bitboxSDK({ restURL: `https://rest.bitcoin.com/v2/` })
    : new bitboxSDK({ restURL: `https://trest.bitcoin.com/v2/` });


class Wallet {
  createWallet() {
    const lang = "english";
    let outStr = "";
    const outObj = {};
    let cassAddresses=[];

    // create 256 bit BIP39 mnemonic
    const mnemonic = bitbox.Mnemonic.generate(
      128,
      bitbox.Mnemonic.wordLists()[lang]
    );

    // console.log("BIP44 $BCH Wallet");
    outStr += "BIP44 $BCH Wallet\n";
    // console.log(`128 bit ${lang} BIP39 Mnemonic: `, mnemonic);
    outStr += `\n128 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
    outObj.mnemonic = mnemonic;

    // root seed buffer
    const rootSeed = bitbox.Mnemonic.toSeed(mnemonic);

    // master HDNode
    const masterHDNode = bitbox.HDNode.fromSeed(rootSeed, NETWORK);

    // HDNode of BIP44 account
    // console.log(`BIP44 Account: "m/44'/145'/0'"`);
    outStr += `BIP44 Account: "m/44'/145'/0'"\n`;

    // Generate the first 40 seed addresses.
    for (let i = 0; i < 40; i++) {
      const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
      // console.log(
      //   `m/44'/145'/0'/0/${i}: ${bitbox.HDNode.toCashAddress(childNode)}`
      // );
      outStr += `m/44'/145'/0'/0/${i}: ${bitbox.HDNode.toCashAddress(
        childNode
      )}\n`;

      cassAddresses.push(bitbox.HDNode.toCashAddress(childNode));

      // Save the first seed address for use in the .json output file.
      // if (i === 0) {
      //   outObj.cashAddress = bitbox.HDNode.toCashAddress(childNode);
      //   outObj.legacyAddress = bitbox.HDNode.toLegacyAddress(childNode);
      //   outObj.WIF = bitbox.HDNode.toWIF(childNode);
      // }
    }
    outObj.cashAddress= cassAddresses;



    return outObj;
  }
}
module.exports = Wallet;
