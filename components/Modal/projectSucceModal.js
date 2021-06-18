import React, { useState } from 'react';
import Router from 'next/router';
import axios from 'axios';
import * as Swal from 'sweetalert2';
import DotLoader from 'react-spinners/DotLoader';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function ProjectSucess({ resetAllData, walletInfo, images, secret, date, token }) {
    const [modal, setModal] = useState(secret ? true : false);
    const [loading, setLoading] = useState(false);

    function launchProject() {
        // e.preventDefault();
        setLoading(true);
        axios
            .post(
                publicRuntimeConfig.API_URL + '/project/createProject',
                {
                    values: walletInfo.formValue,
                    images: images,
                    date: date,
                    receivingAddresses: walletInfo.wallet.cashAddress
                },
                { headers: { Authorization: 'Bearer ' + token } }
            )
            .then(response => {
                if (response.data.status === 200) {
                    setLoading(false);
                    Swal.fire(response.data.message, 'success', 'success');
                    Router.push('/privateAccount', '/' + response.data.username);
                }
            })
            .catch(err => {
                Swal.fire('Whoops..', 'Something Went Wrong:' + err, 'error');
                // console.log("ERROR WHILE TRYING CREATE CAMPAIGN:", err);
            });
    }

    function handleClose() {
        setModal(false);
        resetAllData(true);
    }

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full  my-4 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-3 border-b border-solid border-gray-300 rounded-t">
                            <button
                                onClick={handleClose}
                                className="p-1 ml-auto bg-transparent border-0 text-red  float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                                <span className="bg-transparent text-black font-black  h-6 w-6 text-3xl block outline-none focus:outline-none">
                                    X
                                </span>
                            </button>
                        </div>

                        {/*body*/}
                        <div className="relative p-6 flex-auto text-center">
                            {loading && (
                                <div className="p-5  flex items-center justify-center object-center z-40">
                                    <DotLoader size={50} color={'#7d73c3'} />
                                </div>
                            )}

                            <p className="py-6 text-green-600 text-2xl font-bold">
                                {' '}
                                Congratulations, Your project is ready to go!
                            </p>

                            <p className="py-2 text-green-600 text-xl ">
                                We have created an wallet for you. Please remember the bellow key
                                phrase to access your wallet.
                            </p>
                            <p className="py-4 text-green-600 text-xl ">
                                {' '}
                                Your Wallet access key phrase is:{' '}
                            </p>

                            <p className="bg-black text-white block p-4 -underline font-black">
                                {' '}
                                {secret.secret}{' '}
                            </p>
                            <p className="pt-10 pb-4 text-xl text-red-400  ">
                                {' '}
                                Write it in a plain paper or if you loose it,you will loose your
                                fund.{' '}
                            </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                            <button
                                className="text-white bg-branding-color  font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                style={{ transition: 'all .15s ease' }}
                                onClick={launchProject}>
                                Launch Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
}
