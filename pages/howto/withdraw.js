import React, { useState } from 'react';
import Layout from '../../components/Layout';

function withdraw() {
    return (
        <Layout>
            <div>
                <div className="flex bg-gray-100 py-4 justify-center">
                    <div className="p-4 text-center max-w-2xl">
                        <div className="md:text-3xl text-3xl font-bold">How to withdraw ?</div>
                        <div className="text-xl font-normal mt-4">
                            To withdraw funds please use your campaigns MNEMONIC PHRASE
                        </div>
                        <div className="font-normal mt-1">
                            (it's 12 words that you got at campaign creation)
                        </div>
                        <div className="text-xl font-normal mt-4">
                            Now you need to import your mnemonic phrase into
                            <a href="https://electroncash.org/"> Electron Cash Wallet</a>
                        </div>
                        <div className="text-xl font-normal mt-4">
                            After import completed setup settings to track 40 receiving addresses,
                            to do that click on <b>Wallet</b> -{'>'} <b>Scan More Addresses</b>, set
                            it for 40 and click <i>Start Scan</i>.
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default withdraw;
