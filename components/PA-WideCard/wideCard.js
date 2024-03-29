import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import Router from 'next/router';
import axios from 'axios';
import getConfig from 'next/config';
import { useSelector } from 'react-redux';
import * as Swal from 'sweetalert2';
import Image from 'next/image';

const { publicRuntimeConfig } = getConfig();

const wideCard = props => {
    const dispatch = props.dispatch;
    const token = useSelector(state => state.token);
    const [isNotCompleted, setIsNotCompleted] = useState(true);
    const [transactionCleared, setTransactionCleared] = useState(false);
    useEffect(() => {
        axios
            .post(publicRuntimeConfig.API_URL + '/project/checkGoalStatus', {
                id: props.projectID
            })
            .then(res => {
                if (res.data.status === 201) {
                    setIsNotCompleted(false);
                    if (res.data.cleared) {
                        setTransactionCleared(true);
                    }
                } else if (res.data.status === 200) {
                    if (res.data.cleared) {
                        setTransactionCleared(true);
                    }
                }
            })
            .catch(err => console.log(err));
    }, []);
    const countdownTimer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            setIsNotCompleted(false);
            return (
                <div>
                    <h6>This Project Has Ended</h6>
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
    let endTime = props.fundingEnds ? props.fundingEnds.split('.')[0] : '';

    const handleProjectDetailsRoute = () => {
        const project_id = props.projectID;
        Router.push(`/project/[id]`, `/project/${project_id}`, {
            shallow: true
        });
    };
    const withDrawFunds = () => {
        // Show info message: How to withdraw with MNEMONIC PHRASE
        let msg =
            "To withdraw your funds please use your campaigns MNEMONIC PHRASE, for more details see: <a href='https://sponsors.cash/howto/withdraw'> how to withdraw</a> ";
        Swal.fire({
            title: 'How to withdraw',
            html: msg
        });
    };
    const cancelProject = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'w-40 mx-2 h-auto bg-green-400 p-4 ',
                cancelButton: 'w-40  mx-2 h-auto bg-red-400 p-4 '
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            })
            .then(result => {
                if (result.isConfirmed) {
                    axios
                        .post(
                            publicRuntimeConfig.API_URL + '/project/cancelProject',
                            {
                                projectId: props.projectID
                            },
                            { headers: { Authorization: 'Bearer ' + token } }
                        )
                        .then(res => {
                            if (res.data.status === 200) {
                                setTransactionCleared(true);
                                dispatch({ type: 'CANCEL_PROJECT', payload: props.projectID });
                                swalWithBootstrapButtons.fire(
                                    'Deleted!',
                                    'Your project has been deleted.',
                                    'success'
                                );
                            } else {
                                Swal.fire('Whoops', res.data.message, 'error');
                            }
                        })
                        .catch(err => console.log(err));
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire('Cancelled', 'Your project is safe :)', 'error');
                }
            });
    };
    const editProject = () => {
        const project_id = props.projectID;
        Router.push(`/editcampaign/[id]`, `/editcampaign/${project_id}`, {
            shallow: true
        });
    };

    return (
        <>
            <div className=" shadow-md rounded-20px pt-4 pb-4 px-4 lg:px-6 gird grid-cols mb-4 border-1">
                <div className=" lg:px-4">
                    <div className="grid grid-cols-12 items-center lg:gap-x-4 gap-y-4">
                        <div
                            className="col-span-12 lg:col-span-6 cursor-pointer"
                            onClick={handleProjectDetailsRoute}>
                            <div className="grid grid-cols-12 gap-4 ">
                                <div className="col-span-12 lg:col-span-2 pl-0 ">
                                    <div className="w-20 h-20 relative overflow-hidden rounded-20px mr-6 m-auto">
                                        <Image
                                            layout="fill"
                                            objectFit="cover"
                                            src={`${publicRuntimeConfig.API_URL}/media/project/${
                                                props.imgSrc
                                            }`}
                                            alt={props.title ? props.title : 'content image'}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 lg:col-span-5 pl-2 ">
                                    <div className="text-center lg:text-left lg:pt-2 ">
                                        <p className="text-funded text-md uppercase font-bold truncate">
                                            {props.title}
                                        </p>
                                        <div className="flex justify-center lg:justify-start">
                                            <p className="px-8 py-1  w-40 truncate  lg:my-0 lg:mx-0 text-white text-sm  border-1 border-white bg-branding-text-color rounded-20px justify-center text-center  ">
                                                {props.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-12 lg:col-span-5 mb-4 lg:mb-0">
                                    <div className="mt-2 p-0 border-none bg-transparent">
                                        <div className="select-none grid grid-cols-2 gap-2 px-1 divide-x divide-black-400 text-center items-center">
                                            <div className="text-center text-funded mr-2">
                                                <p className="text-lg font-bold mb-0  ">
                                                    {props.funded.toFixed(5)} BCH
                                                </p>
                                                <p className="uppercase text-lg ">funded</p>
                                            </div>
                                            <div className="text-center  text-goal">
                                                <p className=" text-lg font-bold">
                                                    {props.goal} BCH
                                                </p>
                                                <p className="uppercase mb-0 text-lg">goal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-12 lg:col-span-8">
                                    <div className=" bg-progress-filled  rounded-2xl px-4 py-3 lg:px-3  lg:py-3 text-center mx-4">
                                        {props.fundingEnds && isNotCompleted ? (
                                            <Countdown date={endTime} renderer={countdownTimer} />
                                        ) : transactionCleared ? (
                                            <h6>Transaction Cleared</h6>
                                        ) : (
                                            <button
                                                className="text-white bg-branding-color rounded-md shadow hover:shadow-xl px-3 py-1.5 "
                                                onClick={withDrawFunds}>
                                                WITHDRAW
                                            </button>
                                        )}

                                        <p className="text-base text-funded uppercase text-center mt-1">
                                            funding end{isNotCompleted ? 's' : 'ed'}
                                        </p>
                                    </div>
                                </div>
                                <div className="close-project col-span-12 lg:col-span-4 text-center py-2">
                                    <div className="lg:flex lg:flex-col">
                                        <button
                                            type="button"
                                            className="ml-1 lg:ml-0 mr-1 lg:mr-0 lg:mx-8 w-32 sm:w-auto  justify-center
                                         border-1 border-branding-text-color hover:text-white text-branding-color rounded-full py-.5 px-4 hover:bg-branding-text-color uppercase"
                                            title="Close this project"
                                            onClick={cancelProject}>
                                            <a>CANCEL</a>
                                        </button>

                                        {!props.hasEnded && (
                                            <button
                                                type="button"
                                                className="mr-1 mt-2 lg:mt-1 lg:mr-0 ml-1 lg:ml-0 lg:mx-8 w-32 sm:w-auto  justify-center
                                         border-1 border-branding-text-color hover:text-white text-branding-color rounded-full py-.5 px-4 hover:bg-branding-text-color uppercase"
                                                title="Close this project"
                                                onClick={editProject}>
                                                <a>EDIT</a>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default wideCard;
