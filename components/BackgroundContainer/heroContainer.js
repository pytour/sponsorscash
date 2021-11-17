import React from 'react';
import styles from '../Card/card.module.css';
import GeneralButton from '../Button/generalButton';
import Router from 'next/router';
import { useSelector } from 'react-redux';

export default function HeroContainer() {
    const token = useSelector(state => state.token);
    const username = useSelector(state => state.username);

    return (
        <>
            <div
                className={`${
                    styles.bgImage
                } text-white bg-gray-700 bg-no-repeat bg-center bg-cover h-ex-large `}>
                <div className=" inset-0 bg-black opacity-75 object-fill h-ex-large  w-full flex flex-col" />
            </div>
            <div className="absolute w-full top-48 ">
                <div className="align-middle items-center justify-center text-white sm:m-8  md:m-0 ">
                    <p className="pl-4 pr-4 w-full z-60 font-bold  md:text-3xl text-xl text-center">
                        Fundraising with bitcoin cash
                    </p>
                    <p className="pl-4 pr-4 z-60 font-md text-center md:text-xl text-lg  mt-3 ">
                        Make the world a better place
                    </p>
                    <div
                        className="mt-3 pl-4 pr-4 text-center"
                        onClick={() => {
                            token
                                ? Router.push('/privateAccount', '/' + username)
                                : Router.push('/login');
                        }}
                        onKeyDown={() => {}}>
                        <GeneralButton title={'Explore'} />
                    </div>
                </div>
            </div>
        </>
    );
}
