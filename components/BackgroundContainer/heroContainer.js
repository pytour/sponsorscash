import React from "react";
import styles from "../Card/card.module.css";
import GeneralButton from "../Button/generalButton";
import Router from "next/router";

export default function HeroContainer(props) {


    return (
        <>

            <div className={`${styles.bgImage} text-white bg-gray-700 bg-no-repeat bg-center bg-cover h-ex-large `}>
                <div className=" inset-0 bg-black opacity-75 object-fill h-ex-large  w-full flex flex-col"/>
            </div>
            <div className="absolute w-full top-48 " >
                <div className="align-middle items-center justify-center text-white sm:m-8  md:m-0 ">
                    <p className="pl-4 pr-4 w-full z-60 font-bold  md:text-3xl text-xl text-center">Fundraising with bitcoin cash</p>
                    <p className="pl-4 pr-4 z-60 font-md text-center md:text-xl text-lg  mt-3 ">Fundme.Cash: Fundraising for the projects and causes you care about.</p>
                    <div className="mt-3 pl-4 pr-4 text-center" onClick={() => {
                        Router.push("/login");
                    }}>
                        <GeneralButton  title={"Explore"}/>
                    </div>
                </div>
            </div>

                {/*<div className="absolute md:p-16 md:top-36 sm:top-8 w-full grid grid-cols-1 gap-8 md:flex md:object-right sm:object-center text-white" >*/}
                {/*<div className=" ">*/}
                    {/*hi*/}
                {/*</div>*/}
                {/*<div className="md:py-10 md:mx-48 sm:m-1 sm:mx-0 sm:py-0">*/}
                {/*<p className="z-60 font-bold md:text-left text-2xl sm:text-center">Fundraising with bitcoin cash</p>*/}
                {/*<p className="z-60 font-md md:text-left text-xl mt-3 sm:text-center">Fundme.Cash: Fundraising for the projects and causes you care about.</p>*/}
                {/*<div className="mt-3 md:text-left sm:text-center" onClick={() => {*/}
                    {/*Router.push("/login");*/}
                {/*}}>*/}
                    {/*<GeneralButton*/}

                        {/*title={"Explore"}/>*/}
                {/*</div>*/}
                {/*</div>*/}




            </>
    );
}
