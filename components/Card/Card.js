import React, { useState } from 'react';
import Router from 'next/router';
import Image from 'next/image';
import PropTypes from 'prop-types';
import axios from 'axios';
import getConfig from 'next/dist/next-server/lib/runtime-config';
import { useSelector } from 'react-redux';
const { publicRuntimeConfig } = getConfig();

const Card = props => {

    const [liked, setLike] = useState(false);
    const toggleLike = () => {
        if (liked) {
            return setLike(false);
        }
        setLike(true);
    };
    const handleProjectDetailsRoute = () => {

        if(props.boosted){
            axios
                .post(publicRuntimeConfig.ADS_SERVER_URL+ '/api/ads/registerView', {
                    bidId: props.bidId
                },{})
                .then(res => {
                    Router.push(`/project/${props.key}]`, props.linkSlug, {
                        shallow: false,

                    });
                })
                .catch(err => {
                    Router.push(`/project/${props.key}]`, props.linkSlug, {
                        shallow: false,

                    });
                    console.log(err)
                });

        }
        else {

            if (props.nested && props.nested === true) {
                Router.push(`/project/${props.key}]`, props.linkSlug, {
                    shallow: true
                });
            } else {
                Router.push(`/project/[id]`, props.linkSlug, {
                    shallow: true
                });
            }
        }
    };
    const progress = Math.round((props.funded * 100) / props.goal);

    return (
        <>
            {!props.smallCard &&  <div className="group rounded-custom overflow-hidden shadow-lg " >
            <div className="rounded-tl-custom rounded-tr-custom  relative w-full h-64 ">
                <Image
                    layout="fill"
                    alt={props.title}
                    objectFit="cover"
                    quality={75}
                    src={props.imageSrc}/>
            </div>
            <div className="pt-2 px-3 flex justify-between">
                <div
                    className="text-sm py-1.5 px-1.5 bg-shadow-card bg-opacity-25 rounded-xl text-progress-bar text-center">
                    {props.tag}
                </div>
                {/*<div className="flex justify-between">*/}
                {/*<div onClick={toggleLike}>*/}
                {/*<p*/}
                {/*className={*/}
                {/*'w-8 h-8  rounded-half  cursor-pointer  text-center items-center mx-auto py-1 ' +*/}
                {/*(liked*/}
                {/*? 'bg-red-400 text-red-400 '*/}
                {/*: 'bg-opacity-50 text-black bg-shadow-card ')*/}
                {/*}>*/}
                {/*<i className="mt-1 text-xl cursor-pointer fa fa-heart fill-current text-white " />*/}
                {/*</p>*/}
                {/*</div>*/}
                {/*</div>*/}


                {props.boosted &&
                <div className="flex justify-between">
                    <div>
                         <img src={'/images/boosterIcon.svg'} className="w-8 h-8"/>
                    </div>
                </div>}

            </div>


            <div className="cursor-pointer px-3 pt-1 pb-3" onClick={handleProjectDetailsRoute}>
                <div className="text-xl text-one-line text-grey-600">
                    {props.title && props.title}
                </div>
                <div className="text-two-line text-goal text-sm py-1">
                    {props.description && props.description}
                </div>
                <div className="border-b-1 mt-3"/>
                <div className=" bg-white mt-2 ">
                    <p className="select-none text-percentage text-center text-base mt-1 font-bold ">
                        {progress + ' %'}
                    </p>

                    <div className="relative my-2 select-none">
                        <div className="overflow-hidden h-5 mb-4 text-xs flex rounded-xl bg-progress-filled">
                            <div
                                style={{ width: progress + '%' }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-progress-bar"
                            />
                        </div>
                    </div>

                    <div
                        className="select-none grid grid-cols-2 gap-2 px-1 divide-x divide-black-400 text-center items-center">
                        <div className="text-center text-funded">
                            <p className="text-lg">{props.funded + ' BCH'}</p>
                            <p className="uppercase text-lg ">funded</p>
                        </div>
                        <div className="text-center  text-goal">
                            <p className=" text-lg">{props.goal + ' BCH'}</p>
                            <p className="uppercase mb-0 text-lg">goal</p>
                        </div>
                    </div>
                </div>
            </div>

            {props.smallCard &&

            <div className=" cursor-pointer px-3 pt-1 pb-3" onClick={handleProjectDetailsRoute}>
                <div className="text-xl text-one-line  text-center text-grey-600">
                    {props.title && props.title}
                </div>
                <button className="focus:outline-none outline-none group-hover:underline my-2 flex items-center mx-auto border border-blue-300 text-sm py-1.5 px-3 bg-shadow-card bg-opacity-25 rounded-xl text-progress-bar">
                   See details
                </button>


            </div> }


        </div> }

            {props.smallCard &&  <div className="group rounded-md overflow-hidden shadow-lg " >
                <div className="rounded-tl-custom rounded-tr-custom  relative w-full h-32 ">
                    <Image
                        layout="fill"
                        alt={props.title}
                        objectFit="cover"
                        quality={75}
                        src={props.imageSrc}/>
                </div>
                <div className="pt-2 px-3 flex justify-between">
                    <div
                        className="text-sm py-1.5 px-1.5 bg-shadow-card bg-opacity-25 rounded-xl text-progress-bar text-center">
                        {props.tag}
                    </div>


                    {props.boosted &&
                    <div className="flex justify-between">
                        <div>
                            <img src={'/images/boosterIcon.svg'} className="w-8 h-8"/>
                        </div>
                    </div>}

                </div>




                <div className=" cursor-pointer px-3 pt-1 pb-3" onClick={handleProjectDetailsRoute}>
                    <div className="text-sm text-two-line  text-center  my-1 text-grey-600">
                        {props.title && props.title}
                    </div>
                    <button className="focus:outline-none outline-none group-hover:underline my-2 flex items-center mx-auto border border-blue-300 text-sm py-1.5 px-3 bg-shadow-card bg-opacity-25 rounded-xl text-progress-bar">
                        See details
                    </button>


                </div>


            </div> }

            </>
    );
};

Card.propTypes = {
    nested: PropTypes.bool,
    key: PropTypes.string,
    linkSlug: PropTypes.string,
    funded: PropTypes.number,
    goal: PropTypes.number,
    imageSrc: PropTypes.string,
    tag: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
    bidId:PropTypes.string,
    boosted: PropTypes.bool,
};

export default Card;
