import React from "react";
import frenchStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import getConfig from "next/config";
import Link from "next/link";

const BigNumber = require('bignumber.js');
const formatter = buildFormatter(frenchStrings);

const {publicRuntimeConfig} = getConfig();

const sponsors = (props) => {

    let link =props && props.tx && "https://explorer.bitcoin.com/bch/tx/"+props.tx
    console.log(props)
    function formatDate(date) {
        let diff = new Date() - date; // the difference in milliseconds

        if (diff < 1000) {
            // less than 1 second
            return "right now";
        }

        let sec = Math.floor(diff / 1000); // convert diff to seconds

        if (sec < 60) {
            return sec + " sec. ago";
        }

        let min = Math.floor(diff / 60000); // convert diff to minutes
        if (min < 60) {
            return min + " min. ago";
        }

        // format the date
        // add leading zeroes to single-digit day/month/hours/minutes
        let d = date;
        d = [
            "0" + d.getDate(),
            "0" + (d.getMonth() + 1),
            "" + d.getFullYear(),
            "0" + d.getHours(),
            "0" + d.getMinutes(),
        ].map((component) => component.slice(-2)); // take last 2 digits of every component

        // join the components into date
        return d.slice(0, 3).join(".") + " " + d.slice(3).join(":");
    }

    function donationValue(val) {
        val = parseFloat(val);
        if (val < 0.0001) return parseFloat(new BigNumber(val).multipliedBy(10 ** 8)) + ' Satoshi';
        return val + ' BCH';
    }
    function handleRoute() {
        route.push("/")
    }

    return (
        <>
          <Link href={link}  passHref={true}>
              <a target="_blank">
                  <div className=" bg-white border-1 border-gray-100 md:p-5 p-3 rounded-md tracking-wide shadow" >
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-start-1 col-end-5">
                        <img alt="mountain" className="md:w-40 w-24 rounded-md border-1 border-gray-100"
                             src={
                                 props.avatar
                                     ? publicRuntimeConfig.APP_URL + "/media/user/" + props.avatar
                                     : publicRuntimeConfig.APP_URL + "/media/user/user-avatar.png"
                             }/>
                    </div>
                    <div className="col-start-5 col-end-13 py-2 md:py-4">
                        <div className="max-w-7xl mx-auto  flex items-center justify-between">

                            <div
                                className="md:text-lg text-sm font-semibold">
                                {props.name}
                                </div>
                            <div
                                className="font-semibold md:text-lg text-sm flex lg:mt-0 lg:flex-shrink-0">
                                {props.donation && donationValue(props.donation)}
                                </div>
                        </div>
                        <div className="text-gray-800 mt-2 md:text-xl text-sm">{props.comment ? props.comment : "Thank you"}</div>

                    </div>
                </div>
            </div>

              </a>
          </Link>
            {/*<div*/}
            {/*className="bg-white rounded-xl shadow-md   sm:flex sm:items-center sm:space-y-0 sm:space-x-6">*/}
            {/*<img className=" w-32 h-32 md:w-48 md:h-48 block mx-auto  rounded-full  md:rounded-none sm:mx-0 sm:flex-shrink-0"*/}
            {/*src={*/}
            {/*props.avatar*/}
            {/*? publicRuntimeConfig.APP_URL + "/media/user/" + props.avatar*/}
            {/*: publicRuntimeConfig.APP_URL + "/media/user/user-avatar.png"*/}
            {/*}*/}

            {/*alt="Woman's Face"/>*/}
            {/*<div className="text-center space-y-2 sm:text-left">*/}
            {/*<div className="space-y-0.5">*/}
            {/*<p className="text-lg text-black font-semibold">*/}
            {/*Erin Lindford*/}
            {/*</p>*/}
            {/*<p className="text-gray-500 font-medium">*/}
            {/*Product Engineer*/}
            {/*</p>*/}
            {/*</div>*/}
            {/*<button*/}
            {/*className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Message*/}
            {/*</button>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div className="rounded-3xl overflow-hidden shadow">*/}
            {/*<Image*/}
            {/*layout="responsive"*/}
            {/*width={100}*/}
            {/*height={100}*/}
            {/*src={*/}
            {/*props.avatar*/}
            {/*? publicRuntimeConfig.APP_URL + "/media/user/" + props.avatar*/}
            {/*: publicRuntimeConfig.APP_URL + "/media/user/user-avatar.png"*/}
            {/*}*/}
            {/*className="w-full"*/}
            {/*alt="avatar"*/}
            {/*/>*/}
            {/*</div>*/}
            {/*<div className="">*/}
            {/*<div className="flex flex-col">*/}
            {/*{props.username ? (*/}
            {/*<Link href={"/" + props.username}>*/}
            {/*<a><p className="text-timer text-base mb-2 text-center">*/}
            {/*{props.name}*/}
            {/*</p>*/}
            {/*</a>*/}
            {/*</Link>*/}
            {/*) : (*/}
            {/*<p className="text-timer text-base mb-2 text-center">*/}
            {/*{props.name}*/}
            {/*</p>*/}
            {/*)}*/}

            {/*{props.name == "Anonymous" ? (*/}
            {/*<Link href={"https://explorer.bitcoin.com/bch/tx/" + props.tx}>*/}
            {/*<a>*/}
            {/*<div className="text-timer text-base mb-2 text-center">*/}
            {/*<p className="text-timer text-lg font-bold  text-center">*/}
            {/*{props.donation && donationValue(props.donation)}*/}
            {/*</p>*/}
            {/*<TimeAgo date={new Date(props.date)} formatter={formatter}/>*/}
            {/*</div>*/}
            {/*</a>*/}
            {/*</Link>*/}
            {/*) : (*/}
            {/*<p className="text-timer text-lg font-bold  text-center">*/}
            {/*{props.donation && donationValue(props.donation)}*/}
            {/*</p>*/}
            {/*)}*/}
            {/*</div>*/}
            {/*</div>*/}


            {/*<div className="rounded-3xl overflow-hidden shadow">*/}
            {/*<Image*/}
            {/*layout="responsive"*/}
            {/*width={100}*/}
            {/*height={100}*/}
            {/*src={*/}
            {/*props.avatar*/}
            {/*? publicRuntimeConfig.APP_URL + "/media/user/" + props.avatar*/}
            {/*: publicRuntimeConfig.APP_URL + "/media/user/user-avatar.png"*/}
            {/*}*/}
            {/*className="w-full"*/}
            {/*alt="avatar"*/}
            {/*/>*/}
            {/*</div>*/}
            {/*<div className="">*/}
            {/*<div className="flex flex-col">*/}
            {/*{props.username ? (*/}
            {/*<Link href={"/" + props.username}>*/}
            {/*<a><p className="text-timer text-base mb-2 text-center">*/}
            {/*{props.name}*/}
            {/*</p>*/}
            {/*</a>*/}
            {/*</Link>*/}
            {/*) : (*/}
            {/*<p className="text-timer text-base mb-2 text-center">*/}
            {/*{props.name}*/}
            {/*</p>*/}
            {/*)}*/}

            {/*{props.name == "Anonymous" ? (*/}
            {/*<Link href={"https://explorer.bitcoin.com/bch/tx/" + props.tx}>*/}
            {/*<a>*/}
            {/*<div className="text-timer text-base mb-2 text-center">*/}
            {/*<p className="text-timer text-lg font-bold  text-center">*/}
            {/*{props.donation && donationValue(props.donation)}*/}
            {/*</p>*/}
            {/*<TimeAgo date={new Date(props.date)} formatter={formatter}/>*/}
            {/*</div>*/}
            {/*</a>*/}
            {/*</Link>*/}
            {/*) : (*/}
            {/*<p className="text-timer text-lg font-bold  text-center">*/}
            {/*{props.donation && donationValue(props.donation)}*/}
            {/*</p>*/}
            {/*)}*/}
            {/*</div>*/}
            {/*</div>*/}

        </>
    );
};

export default sponsors;
