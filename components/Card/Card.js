import React, {useState} from "react";
import Router from "next/router";
import Image from "next/image";

const myLoader = ({src, width, quality}) => {
    return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}


const Card = (props) => {
    const [liked, setLike] = useState(false);
    const toggleLike = () => {
        if (liked) {
            return setLike(false);
        }
        setLike(true);
    };
    const handleProjectDetailsRoute = () => {
        Router.push(`/project/[id]`, props.linkSlug, {
            shallow: true,
        });
    };
    const progress = Math.round((props.funded * 100) / props.goal);


    return (
            <div className="rounded-custom overflow-hidden shadow-lg ">
                <div className="rounded-tl-custom rounded-tr-custom  relative w-full h-64 ">
                    <Image
                        layout="fill"
                        objectFit="cover"
                        src={props.imageSrc}
                    />
                </div>
                <div className=" absolute top-1/20 left-1/20 w-90 h-card text-right flex flex-col  justify-between">
                    <div className="flex justify-between">
                        <div onClick={toggleLike}>
                            <p className="w-10 h-10 bg-opacity-50 rounded-half bg-shadow-card text-center items-center mx-auto py-1.5">
                                <i className={"text-2xl cursor-pointer fa fa-heart fill-current " + (liked ? 'text-orange' : 'text-white')}
                                />
                            </p>
                        </div>
                    </div>
                    <p className="text-white text-md p-1.5 mb-2 max-w-64 w-32 bg-branding-text-color rounded-2xl text-center block">
                        {props.tag}
                    </p>
                </div>
                <div className="cursor-pointer p-3"
                     onClick={handleProjectDetailsRoute}
                >
                    <div className="text-2xl text-grey-600">
                        {props.title && props.title.length > 20
                            ? props.title.substr(0, 21) + "..."
                            : props.title}
                    </div>
                    <div className="text-goal text-sm py-1">
                        {props.description && props.description.length > 65
                            ? props.description.substr(0, 65) + "..."
                            : props.description}
                    </div>
                    <div className="border-b-1 mt-3"/>
                    <div className=" bg-white mt-2 ">
                        <p className="text-percentage text-center text-base mt-1 font-bold ">{progress + " %"}</p>

                        <div className="relative my-2">
                            <div className="overflow-hidden h-5 mb-4 text-xs flex rounded-xl bg-progress-filled">
                                <div style={{width: progress + "%"}}
                                     className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-progress-bar"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 px-1 divide-x divide-black-400 text-center items-center">
                            <div className="text-center text-funded">
                                <p className="text-lg">
                                    {props.funded + " BCH"}
                                </p>
                                <p className="uppercase text-lg ">funded</p></div>
                            <div className="text-center  text-goal">
                                <p className=" text-lg">
                                    {props.goal + " BCH"}
                                </p>
                                <p className="uppercase mb-0 text-lg">goal</p></div>
                        </div>

                    </div>
                </div>
            </div>
    );
};

export default Card;
