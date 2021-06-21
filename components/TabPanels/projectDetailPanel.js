import React from 'react';
import getConfig from 'next/config';
import Link from 'next/link';
import DotLoader from 'react-spinners/DotLoader';

const { publicRuntimeConfig } = getConfig();
const projectDetailPanel = props => {
    //if (props.projectCreator) console.log(props.projectCreator);
    let avatarImg = props.projectCreator.avatar
        ? `background: url(${publicRuntimeConfig.API_URL}/media/user/${
              props.projectCreator.avatar
          })`
        : `background: url(${publicRuntimeConfig.API_URL}/media/user/user-avatar.png)`;
    return (
        <>
            <div>
                <div className="grid">
                    {!props.details && <DotLoader size={50} color={'#7d73c3'} />}
                    <div>
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center mt-2 mb-3">
                            <p className="text-xl lg:text-2xl text-funded uppercase font-bold lg:mb-0 py-3 lg:mr-5 ">
                                {props.details.title}
                            </p>

                            <Link href={'/' + props.projectCreator.username}>
                                <a className="text-decoration-none pt-1 pb-3">
                                    <div className="flex justify-between items-center pl-4 border-branding-color border-1 rounded-full w-full max-w-12rem ">
                                        <p className=" text-branding-color mb-0 pr-10">
                                            {props.projectCreator.creator}
                                        </p>
                                        <div className="block relative w-12 h-12 overflow-hidden rounded-half">
                                            <img
                                                src={
                                                    props.projectCreator.avatar
                                                        ? `${
                                                              publicRuntimeConfig.API_URL
                                                          }/media/user/${
                                                              props.projectCreator.avatar
                                                          }`
                                                        : `${
                                                              publicRuntimeConfig.API_URL
                                                          }/media/user/user-avatar.png`
                                                }
                                                alt="Fund me cash project avatar"
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </div>

                        <p className="text-custom whitespace-pre-wrap">{props.details.details}</p>
                        {props.details.approved && (
                            <div className="shadow-lg rounded-full text-gray mt-10 mb-10">
                                <div>
                                    <div className="p-3">
                                        <p />
                                        <i className="fas fa-user-check m-2" size="12">
                                            {' '}
                                            Campaign approved by SPONSORS.CASH team
                                        </i>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default projectDetailPanel;
