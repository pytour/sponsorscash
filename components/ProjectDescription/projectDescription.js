import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import * as Swal from "sweetalert2";
import {useSelector} from "react-redux";

import getConfig from "next/config";
import Countdown from "react-countdown";
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
} from "react-share";

const bitboxSDK = require("bitbox-sdk").BITBOX;
const BITBOX = new bitboxSDK();
const {publicRuntimeConfig} = getConfig();

const projectDescription = (props) => {
    const [modal, setModal] = useState(false);
    const [modalShare, setModalShare] = useState(false);
    const [amount, setAmount] = useState(0);
    const [funded, setFunded] = useState(0);
    // const [fee, setFee] = useState(0);
    const [isNotCompleted, setIsNotCompleted] = useState(true);
    const token = useSelector((state) => state.token);
    const username = useSelector((state) => state.username);
    const userId = useSelector((state) => state.id);
    const name = useSelector((state) => state.name);
    const image = useSelector((state) => state.image);
    const [copySuccess, setCopySuccess] = useState("");
    const textAreaRef = useRef(null);

    function copyToClipboard(e) {
        textAreaRef.current.select();
        document.execCommand("copy");
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
        setCopySuccess("Copied!");
    }

    useEffect(() => {
        if (props.id) {
            // console.log("description prop", props);
            axios
                .post(publicRuntimeConfig.APP_URL + "/project/checkGoalStatus", {
                    id: props.id,
                })
                .then((res) => {
                    // console.log("is hitted: ", res.data.status);
                    if (res.data.status === 201) {
                        console.log("PROJECT GOAL HITTED");
                        // Goal hitted ,but Countdown may be not ended then donations active
                        setIsNotCompleted(false);
                    }
                    if (true) {
                        // if (!props.hasEnded)
                        axios
                            .post(publicRuntimeConfig.APP_URL + "/project/checkFunds", {
                                projectID: props.id,
                            })
                            .then((funds) => {
                                if (funds.data.status === 200) {
                                    console.log("projDescription checkFunds:", funds.data.funded);
                                    let fundedVal =
                                        funds.data.funded > props.funded
                                            ? funds.data.funded
                                            : props.funded;
                                    setFunded(fundedVal);
                                } else if (funds.data.status === 400) {
                                    console.log(
                                        "projDescription :: Error at checkFunds:",
                                        funds.data.message
                                    );
                                    setFunded(props.funded);
                                }
                            })
                            .catch((err) => {
                                console.log(
                                    "projDescription:: Error at checkFunds: ",
                                    err.message
                                );
                                setFunded(props.funded);
                            });
                    } else {
                        setFunded(props.funded);
                    }
                })
                .catch((err) => console.log("Error at checkGoalStatus: ", err.message));
        } else {
            setFunded(props.funded);
        }
    }, [props.id]);

    useEffect(() => {
        setFunded(props.funded);
    }, [props.funded]);

    const sendBch = () => {
        if (!token || !username) {
            Swal.fire(
                "Login first",
                "To pay with Badger please login to Fundme.cash",
                "error"
            );
            return;
        }
        if (amount < publicRuntimeConfig.MINIMUM_AMOUNT) {
            Swal.fire("Dust Amount", "Amount must be at least 0.0002 BCH", "error");
            return;
        }
        if (typeof web4bch !== "undefined") {
            web4bch = new Web4Bch(web4bch.currentProvider);

            let txParams = {
                to: props.projCashAddress,
                from: web4bch.bch.defaultAccount,
                value: BITBOX.BitcoinCash.toSatoshi(amount),
                opReturn: {
                    data: ["0x6d02", "Fundmecash"],
                },
            };

            web4bch.bch.sendTransaction(txParams, (err, txid) => {
                if (err) {
                    console.log("send err", err);
                } else {
                    axios
                        .post(publicRuntimeConfig.APP_URL + "/project/updateFunds", {
                            projectID: props.id,
                            amount: amount,
                        })
                        .then((res1) => {
                            if (res1.data.status === 201) {
                                setIsNotCompleted(false);
                            }
                            // save this donation to donations db!
                            console.log("save this donation to donations db!");
                            axios
                                .post(
                                    publicRuntimeConfig.APP_URL + "/donations/createDonation",
                                    {
                                        title: props.title,
                                        image: props.images ? props.images[0] : "",
                                        txId: txid,
                                        donatedBCH: parseFloat(amount).toFixed(8),
                                        projectId: props.id,
                                        userId: userId,
                                        name: name, // FROM
                                        username: username,
                                        userImage: image,
                                        address: txParams.from,
                                    }
                                )
                                .then((res) => {
                                    console.log("donation success for user:", username);
                                    console.log("txId:", txid);
                                    // add this donation to projSponsorsTab
                                })
                                .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                    console.log("send success, transaction id:", txid);
                }
            });
        }
    };

    const pay = () => {
        if (amount < publicRuntimeConfig.MINIMUM_AMOUNT) {
            Swal.fire("Dust Amount", "Amount must be at least 0.0002 BCH", "error");
        }
        // Return cashAddress for this project
        Swal.fire("Campaign Cash Address:", props.projCashAddress, "info");
    };

    let endTime = props.endTime ? props.endTime.split(".")[0] : "";

    const calcFees = (e) => {
        let amount = parseFloat(e.target.value);
        let fees = amount * (publicRuntimeConfig.FEE_AMOUNT / 100);
        let depositAmount = (amount * 100 - fees * 100) / 100;
        depositAmount = parseFloat(depositAmount).toFixed(8);
        setAmount(+depositAmount);
    };
    const countdownTimer = ({days, hours, minutes, seconds, completed}) => {
        if (completed) {
            setIsNotCompleted(false);
            axios
                .post(publicRuntimeConfig.APP_URL + "/project/setCompletion", {
                    projectID: props.id,
                    ended: true,
                })
                .then((res) => console.log(res))
                .catch((err) => console.log("Error at setCompletion: ", err.message));
            return (
                <div>
                    <h4>project ended</h4>
                </div>
            );
        } 
        else {
            return (
                <ul className="p-0 mb-0">
                    <li className="inline-block  text-md list-none ">
                        <span className="mx-2 font-bold text-block">{days}</span>:
                    </li>
                    <li className="inline-block  text-md list-none ">
                        <span className="mx-2 font-bold text-block">{hours}</span>:
                    </li>
                    <li className="inline-block  text-md list-none ">
                        <span className="mx-2 font-bold text-block">{minutes}</span>:
                    </li>
                    <li className="inline-block  text-md list-none ">
                        <span className="mx-2 font-bold text-block">{seconds}</span>
                    </li>
                </ul>
            );
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center  ">
                <p className="text-funded text-xl md:text-2xl uppercase font-bold xl:mt-0 md:mt-4 lg:mt-0 sm:mt-4  ">
                    {props.title}
                </p>
            </div>
            <div className="py-2 flex justify-between">

                <div className=" text-md py-1.5 px-2 bg-shadow-card bg-opacity-25 rounded-xl text-progress-bar text-center block">
                    {props.category}
                </div>
            </div>
            <p className="text-goal justify-between break-words">{props.description}</p>


            <div className="grid lg:grid-cols-5 gap-y-4 gap-x-8 mb-3 pt-3 pb-1">
                <div className="lg:col-span-2  text-center bg-card bg-opacity-50 px-4 py-2 rounded-2xl">
                    {props.endTime && isNotCompleted ? (
                        <Countdown date={endTime} renderer={countdownTimer}/>
                    ) : (
                        <div className="text-xl  text-center font-medium mb-1">This campaign has ended</div>
                    )}

                    <p className="uppercase text-center mb-0 text-timer">
                        funding ends
                    </p>
                </div>
                <div className="lg:col-span-3 ">
                    <div
                        className="grid grid-cols-2 gap-2 py-3 px-1 divide-x divide-black-400 text-center items-center ">
                        <div className="text-center text-funded text-xl ">
                            <p className="text-xl font-black">
                                {funded ? +parseFloat(funded).toFixed(8) : 0} BCH
                            </p>
                            <p className="uppercase text-xl  text-timer ">funded</p>
                        </div>
                        <div className="text-center  text-goal">
                            <p className=" text-xl text-goal font-bold">
                                {props.goal} BCH
                            </p>
                            <p className="uppercase text-xl  mb-0 text-lg ">goal</p></div>
                    </div>
                </div>
            </div>

            <div className="sm:text-center lg:text-left">
                {props.status === "CANCELED" && (
                    <p className="uppercase py-2 px-1 text-timer text-md ">Campaign cancelled</p>
                )}
                {props.status !== "CANCELED" && isNotCompleted && (
                    <button
                        type="button"
                        onClick={() => {
                            setModal(!modal);
                        }}
                        className="w-full mr-4 mb-2 sm:w-auto inline-flex justify-center text-branding-color focus:text-white  hover:text-white border-1 border-branding-color text-xl rounded-full py-1.5 px-12 hover:bg-branding-color uppercase"
                    >
                        donate now
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        setModalShare(!modalShare);
                    }}
                    className="w-full mb-2 sm:w-auto inline-flex justify-center text-branding-color focus:text-white  hover:text-white border-1 border-branding-color text-xl rounded-full py-1.5 px-12 hover:bg-branding-color uppercase"
                >
                    share
                </button>
            </div>

            {modal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-4 mx-auto max-w-4xl">
                            {/*content*/}
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div
                                    className="flex items-start justify-between p-3 border-b border-solid border-gray-300 rounded-t">
                                    <h4 className="text-3xl font-semibold">
                                        Donate
                                    </h4>
                                    <button onClick={() => setModal(false)}
                                            className="p-1 ml-auto bg-transparent border-0 text-red  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    >
                    <span
                        className="bg-transparent text-black font-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div>
                                        <strong>Enter Amount: </strong>
                                        <input
                                            className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent my-2"
                                            onChange={calcFees} type="text"/>
                                    </div>
                                    <div>
                                        <strong>Platform Fee: {publicRuntimeConfig.FEE_AMOUNT}%</strong>
                                    </div>
                                    <div>
                                        <strong>Sponsoree receive: {amount}</strong>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div
                                    className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                                    <button
                                        className="text-white bg-red-400  font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        style={{transition: "all .15s ease"}}
                                        onClick={() => setModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-branding-color text-white active:bg-branding-color font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        style={{transition: "all .15s ease"}}
                                        onClick={sendBch}>
                                        Pay with Badger
                                    </button>
                                    <button
                                        className="bg-branding-color text-white active:bg-branding-color font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        style={{transition: "all .15s ease"}}
                                        onClick={pay}>
                                        Pay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"/>
                </>
            ) : null}


            {modalShare ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-full  my-4 mx-auto max-w-3xl">
                            {/*content*/}
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div
                                    className="flex items-start justify-between p-3 border-b border-solid border-gray-300 rounded-t">
                                    <h4 className="text-3xl uppercase font-semibold">
                                        Share
                                    </h4>
                                    <button onClick={() => setModalShare(false)}
                                            className="p-1 ml-auto bg-transparent border-0 text-red  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    >
                    <span
                        className="bg-transparent text-black font-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div className="text-center">
                                        <TelegramShareButton
                                            url={`https://fundme.cash/project/${props.id}`}
                                            quote={props.title}
                                            className="py-1.5 px-4 hover:bg-branding-text-color hover:text-white"
                                        >
                                            <TelegramIcon size={32} round/>
                                        </TelegramShareButton>
                                        <FacebookShareButton
                                            url={`https://fundme.cash/project/${props.id}`}
                                            quote={props.title}
                                            className="py-1.5 px-4 hover:bg-branding-text-color hover:text-white"
                                        >
                                            <FacebookIcon size={32} round/>
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            url={`https://fundme.cash/project/${props.id}`}
                                            quote={props.title}
                                            className="py-1.5 px-4 hover:bg-branding-text-color hover:text-white"
                                        >
                                            <TwitterIcon size={32} round/>
                                        </TwitterShareButton>
                                        <div>
                                            {
                                                /* Logical shortcut for only displaying the
                                          button if the copy command exists */
                                                document.queryCommandSupported("copy") && (
                                                    <div className="p-2">
                                                        <button color="primary" onClick={copyToClipboard}
                                                                className="py-2 px-4 border-2 ring-1 text-black bg-white  h-10 mr-4 mb-4 ">

                                                            Copy URL
                                                        </button>
                                                        {copySuccess}
                                                    </div>
                                                )
                                            }
                                            <form>
                                                <textarea
                                                    ref={textAreaRef}
                                                    className="border ring-1 w-70 mx-auto "
                                                    value={`https://fundme.cash/project/${props.id}`}
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div
                                    className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                                    <button
                                        className="text-white bg-red-400  font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        style={{transition: "all .15s ease"}}
                                        onClick={() => setModalShare(false)}
                                    >
                                        Close
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"/>
                </>
            ) : null}
        </div>
    );
};

export default projectDescription;
