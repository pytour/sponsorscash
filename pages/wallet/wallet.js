import React, { useState } from 'react';
const Wallet = require('../../lib/walet/walletCreate');

let wallet = new Wallet();

export default function WalletTest() {
    const [walletData, setWalletData] = useState([]);

    function createWallet() {
        let walletData = wallet.createWallet();
        setWalletData(walletData);
    }
    return (
        <div>
            <button onClick={createWallet} className="p-4 bg-red-400 focus:bg-black">
                generate address
            </button>
            <p> hi remember this key phrase,or you will loose your walet.</p>
            <h3> Your key is:' {walletData.mnemonic} ` </h3>
            Wallet info:
            {walletData &&
                walletData.cashAddress &&
                walletData.cashAddress.map(obj => {
                    return <div>address: {obj}</div>;
                })}
        </div>
    );
}
