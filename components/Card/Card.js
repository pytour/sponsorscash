import React, { useState } from 'react';
import Router from 'next/router';
import Image from 'next/image';
import PropTypes from 'prop-types';

const Card = props => {
    const [liked, setLike] = useState(false);
    const toggleLike = () => {
        if (liked) {
            return setLike(false);
        }
        setLike(true);
    };
    const handleProjectDetailsRoute = () => {
        if (props.nested && props.nested === true) {
            Router.push(`/project/${props.key}]`, props.linkSlug, {
                shallow: true
            });
        } else {
            Router.push(`/project/[id]`, props.linkSlug, {
                shallow: true
            });
        }
    };
    const progress = Math.round((props.funded * 100) / props.goal);

    return (
        <div className="group rounded-custom overflow-hidden shadow-lg ">
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
        </div>
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
    title: PropTypes.string
};

export default Card;
