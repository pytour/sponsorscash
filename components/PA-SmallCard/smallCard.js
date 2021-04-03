import React from 'react';
import getConfig from 'next/config';
import Image from 'next/image';

const { publicRuntimeConfig } = getConfig();

const smallCard = props => {
    return (
        <div className="shadow rounded-3xl py-4 px-4">
            <div className="grid grid-cols-11 items-center gap-2">
                <div className="col-span-3">
                    <div className="h-16 w-16 relative overflow-hidden rounded-xl mr-6 ">
                        <Image
                            layout="fill"
                            objectFit="cover"
                            src={`${publicRuntimeConfig.APP_URL}/media/project/${props.imgSrc}`}
                            alt={props.tag}
                        />
                    </div>
                </div>
                <div className="col-span-1"> </div>
                <div className="col-span-7 ">
                    <div className="text-left">
                        <p className="text-funded  text-lg uppercase font-bold truncate">
                            {props.text || 'default text'}
                        </p>
                        <div className="text-percentage text-md flex justify-between py-.5 text-center">
                            {props.tag ? (
                                <div className=" text-sm p-1 bg-light  rounded-xl text-progress-bar text-center block">
                                    education
                                </div>
                            ) : (
                                <p />
                            )}
                            <p className="font-bold  py-.5 ">{props.value + ' BCH'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default smallCard;
