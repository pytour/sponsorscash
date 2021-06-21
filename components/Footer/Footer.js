import React from 'react';
import Link from 'next/link';
import GeneralButton from '../Button/generalButton';
import Router from 'next/router';

const Footer = () => {
    return (
        <div className="min-h-48 flex items-center justify-center bg-branding-color py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-xl w-full space-y-8">
                <div>
                    <Link href="/">
                        <a>
                            {/* <img className="mx-auto h-16 w-auto"
                                 src="/images/logo.png"
                                 alt="logo"
                            /> */}

                            <div className="mx-auto h-26 w-24 bg-gray-100 p-1 m-1.5 rounded-xl">
                                <img  alt="fund me cash logo"
                                      width="96" height="88"
                                      className="h-22" src="/images/logo.png"  />
                            </div>

                            <p className="mx-auto mt-6 text-center text-2xl font-bold text-branding-text-color">
                                SPONSORS<span className="text-white">.CASH</span>
                            </p>
                        </a>
                    </Link>
                    <div className="mt-4 text-center">
                        <p className="text-base text-white">
                            Thanks to everyone who support our flipstarter campaign.
                        </p>
                        <p className="mt-4 text-base text-white">
                            For non-custodial fundraising use:{' '}
                        </p>
                        <div className="mb-1">
                            <Link href="https://flipstarter.cash">
                                <a>
                                    {' '}
                                    <img
                                        width="40" height="56"
                                        src="https://flipstarter.cash/static/img/logo-alt.svg"
                                        alt="flipstarter"
                                        className="m-3.5 w-10 h-14 mx-auto"
                                    />
                                </a>
                            </Link>

                            <Link href="https://flipstarter.cash">
                                <a className="text-sm text-white">
                                    FLIPSTARTER<span>.CASH</span>
                                </a>
                            </Link>
                        </div>
                        <div>
                            <div className="flex md:flex-row flex-col items-center justify-center">
                                <div
                                    className="m-3 w-full  sm:w-auto"
                                    onClick={() => {
                                        Router.push(
                                            'https://sponsors.cash/api/media/files/whitepaper.pdf'
                                        );
                                    }}
                                    onKeyDown={() => {}}>
                                    <GeneralButton title={'whitepaper'} />
                                </div>

                                <div className="m-2 w-full  sm:w-auto">
                                    <Link href="/faq">
                                        <a className="text-white">
                                            <GeneralButton title={'FAQ'} />
                                        </a>
                                    </Link>
                                </div>
                                <div className="m-2 w-full  sm:w-auto">
                                    <Link href="https://t.me/sponsorschat">
                                        <a className="text-white">
                                            <GeneralButton title={'contact us'} />
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
