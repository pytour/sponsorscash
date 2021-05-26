import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import getConfig from 'next/config';
import Countdown from 'react-countdown';
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton
} from 'react-share';
import { useFormik } from 'formik';
import DonationModal from './DonationModal';
import * as Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const { publicRuntimeConfig } = getConfig();

const validate = values => {
    const errors = {};

    if (!values.comment) {
        errors.comment = 'Required';
    }

    if (!values.name) {
        errors.name = 'Required';
    }

    if (!values.amount) {
        errors.amount = 'Required';
    } else {
        let amount = +values.amount;
        if (typeof amount !== 'number' && !isNaN(amount)) {
            errors.amount = 'Must be number';
        } else if (amount < 0.0001) {
            errors.amount = 'Must be greater than 0.0001 BCH';
        }
    }

    return errors;
};

const projectDescription = props => {
    const [modal, setModal] = useState(false);
    const [modalShare, setModalShare] = useState(false);
    const [funded, setFunded] = useState(0);
    const [isNotCompleted, setIsNotCompleted] = useState(true);
    const userId = useSelector(state => state.id);
    const [copySuccess, setCopySuccess] = useState('');
    const textAreaRef = useRef(null);
    const [receivingAddress, setReceivingAddress] = useState(null);
    const token = useSelector(state => state.token);
    const [copier, setCopier] = useState(false);
    const Router = useRouter();

    function handleCopyFunc(value) {
        setCopier(true);
    }

    function copyToClipboard(e) {
        textAreaRef.current.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
        setCopySuccess('Copied!');
    }

    useEffect(() => {
        if (props.projCashAddress) {
            setReceivingAddress(props.projCashAddress)
        }
        if (props.id) {
            axios
                .post(publicRuntimeConfig.APP_URL + '/project/checkGoalStatus', {
                    id: props.id
                })
                .then(res => {
                    if (res.data.status === 201) {
                        console.log('PROJECT GOAL HITTED');
                        // Goal hitted ,but Countdown may be not ended then donations active
                        setIsNotCompleted(false);
                    }

                    axios
                        .post(publicRuntimeConfig.APP_URL + '/project/checkFunds', {
                            projectID: props.id
                        })
                        .then(funds => {
                            if (funds.data.status === 200) {
                                console.log('projDescription checkFunds:', funds.data.funded);
                                let fundedVal =
                                    funds.data.funded > props.funded
                                        ? funds.data.funded
                                        : props.funded;
                                setFunded(fundedVal);
                            } else if (funds.data.status === 400) {
                                console.log(
                                    'projDescription :: Error at checkFunds:',
                                    funds.data.message
                                );
                                setFunded(props.funded);
                            }
                        })
                        .catch(err => {
                            console.log('projDescription:: Error at checkFunds: ', err.message);
                            setFunded(props.funded);
                        });
                })
                .catch(err => console.log('Error at checkGoalStatus: ', err.message));
        } else {
            setFunded(props.funded);
        }
    }, [props.id]);

    useEffect(() => {
        setFunded(props.funded);
    }, [props.funded]);

    let endTime = props.endTime ? props.endTime.split('.')[0] : '';

    const countdownTimer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            setIsNotCompleted(false);
            axios
                .post(publicRuntimeConfig.APP_URL + '/project/setCompletion', {
                    projectID: props.id,
                    ended: true
                })
                .then(res => console.log(res))
                .catch(err => console.log('Error at setCompletion: ', err.message));
            return (
                <div>
                    <h4>project ended</h4>
                </div>
            );
        } else {
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

    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            amount: 0
        },
        validate,
        onSubmit: (values, { resetForm }) => {

            if (props.projCashAddress) {
                setReceivingAddress(props.projCashAddress)
            }
            else {
                axios
                    .get(publicRuntimeConfig.APP_URL + '/donations/getDonationAddress', {
                        params: {
                            projectId: props.id,
                            name: values.name,
                            amount: values.amount,
                            comment: values.comment,
                            userId: userId ? userId : null
                        }
                    })
                    .then(res1 => {
                        if (res1.data.status === 200) {
                            setReceivingAddress(res1.data.data.address.address);
                            // console.log("succeed",res1.data.data.address.address);
                            // setIsNotCompleted(false);
                            // Swal.fire("Campaign Cash Address to send money:", res1.data.data.address.address, "info");
                        } else console.log(res1, 'error');
                    })
                    .catch(err => console.log(err));

                setTimeout(() => {
                    resetForm();
                }, 1500);
            }
        }
    });

    function handleDonateNow() {
        setModal(!modal);
    }
    function handleModlaClose() {
        setModal(false);
        formik.resetForm();
        setReceivingAddress(null);
    }

    function handleModalCloseWithReset() {
        setModal(false);
        formik.resetForm();
        setReceivingAddress(null);
    }
    function handleBoost() {
        if(token) {
            Swal.fire({
                title: 'Awesome!You want to boost this campaign?',
                showCancelButton: true,
                confirmButtonText: `Confirm`,
            }).then((result) => {
                if (result.isConfirmed) {
                    let projectId=props.id;
                    let adsServer=publicRuntimeConfig.ADS_SERVER_URL +'/home/'+token+'/'+projectId;
                    window.location.href=(adsServer)
                    // console.log(adsServer,'add')
                }
            })
        }
        else {
            Swal.fire({
                title: 'For boost this project you need to login first',
                showCancelButton: true,
                confirmButtonText: `Confirm`,
            }).then((result) => {
                if (result.isConfirmed) {
                        Router.push('/login')
                }
            })
        }

    }
    return (
        <div>
            <div className="flex  items-center justify-center  xl:justify-start">
                <p className="text-center xl:text-left  text-funded text-xl md:text-xl uppercase font-bold xl:mt-0 md:mt-4 lg:mt-0 sm:mt-4  ">
                    {props.title}
                </p>
            </div>

            <div className="py-2 flex justify-between">
                <div
                    className=" text-md py-1.5 px-2 bg-shadow-card bg-opacity-25 rounded-xl text-progress-bar  lg:block">
                    <p className="text-center lg:text-left "> {props.category} </p>
                </div>

            <button
                type="button"
                onClick={handleBoost}
                className="focus:outline-none md:mr-12 hover:shadow-xl w-auto  focus:bg-branding-color hover:bg-branding-color inline-flex hover:font-bold
                justify-center text-branding-color focus:text-white hover:text-white border-1 border-branding-color text-sm rounded-full py-1.5 px-4">
                <img src={'/images/boosterIcon.svg'} className="w-5 h-5 mr-3"/>  Boost
            </button>
            </div>

            <p className="text-center lg:text-left text-goal break-words">{props.description}</p>

            <div className="grid lg:grid-cols-5 gap-y-4 gap-x-8 mb-3 pt-3 pb-1">
                <div className="lg:col-span-5  text-center bg-card bg-opacity-50 px-4 py-2 rounded-2xl">
                    {props.endTime && isNotCompleted ? (
                        <Countdown date={endTime} renderer={countdownTimer}/>
                    ) : (
                        <div className="text-xl  text-center font-medium mb-1">
                            This campaign has ended
                        </div>
                    )}

                    <p className="uppercase text-center mb-0 text-timer">funding ends</p>
                </div>
                <div className="lg:col-span-5 ">
                    <div
                        className="grid grid-cols-2 gap-2 py-3 px-1 divide-x divide-black-400 text-center items-center ">
                        <div className="text-center text-funded text-xl ">
                            <p className="text-xl font-black">
                                {funded ? +parseFloat(funded).toFixed(8) : 0} BCH
                            </p>
                            <p className="uppercase text-xl  text-timer ">funded</p>
                        </div>
                        <div className="text-center  text-goal">
                            <p className=" text-xl text-goal font-bold">{props.goal} BCH</p>
                            <p className="uppercase text-xl  mb-0">goal</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sm:text-center lg:text-left">
                {props.status === 'CANCELED' && (
                    <p className="uppercase py-2 px-1 text-timer text-md ">Campaign cancelled</p>
                )}
                {props.status !== 'CANCELED' &&
                isNotCompleted &&
                (
                    <button
                        type="button"
                        onClick={handleDonateNow}
                        className="w-full mr-4 mb-2 sm:w-auto inline-flex justify-center text-branding-color focus:text-white  hover:text-white border-1 border-branding-color text-md rounded-full py-1.5 px-12 hover:bg-branding-color uppercase">
                        donate now
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        setModalShare(!modalShare);
                    }}
                    className="w-full mb-2 sm:w-auto inline-flex justify-center text-branding-color focus:text-white  hover:text-white border-1 border-branding-color text-md rounded-full py-1.5 px-12 hover:bg-branding-color uppercase">
                    share
                </button>
            </div>
            {/* TODO: to support legacy code, check if project have property projCashAddress then return wallet */}
            <DonationModal modal={modal} receivingAddress={receivingAddress} onClick={handleModlaClose} formik={formik}
                           onClick1={handleModalCloseWithReset} props={props} onCopy={() => console.log('copied')}
                           onClick2={handleCopyFunc} copier={copier}/>

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
                                    <h4 className="text-3xl uppercase font-semibold">Share</h4>
                                    <button
                                        onClick={() => setModalShare(false)}
                                        className="p-1 ml-auto bg-transparent border-0 text-red  float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
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
                                            className="py-1.5 px-4 hover:bg-branding-text-color hover:text-white">
                                            <TelegramIcon size={32} round/>
                                        </TelegramShareButton>
                                        <FacebookShareButton
                                            url={`https://fundme.cash/project/${props.id}`}
                                            quote={props.title}
                                            className="py-1.5 px-4 hover:bg-branding-text-color hover:text-white">
                                            <FacebookIcon size={32} round/>
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            url={`https://fundme.cash/project/${props.id}`}
                                            quote={props.title}
                                            className="py-1.5 px-4 hover:bg-branding-text-color hover:text-white">
                                            <TwitterIcon size={32} round/>
                                        </TwitterShareButton>
                                        <div>
                                            {/* Logical shortcut for only displaying the
                                          button if the copy command exists */
                                                document.queryCommandSupported('copy') && (
                                                    <div className="p-2">
                                                        <button
                                                            color="primary"
                                                            onClick={copyToClipboard}
                                                            className="py-2 px-4 border-2 ring-1 text-black bg-white  h-10 mr-4 mb-4 ">
                                                            Copy URL
                                                        </button>
                                                        {copySuccess}
                                                    </div>
                                                )}
                                            <form>
                                                <textarea
                                                    ref={textAreaRef}
                                                    className="border ring-1 w-70 mx-auto "
                                                    value={`https://fundme.cash/project/${
                                                        props.id
                                                        }`}
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
                                        style={{ transition: 'all .15s ease' }}
                                        onClick={() => setModalShare(false)}>
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
