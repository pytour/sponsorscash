import React, { useEffect, useState } from 'react';
import SmallCard from '../PA-SmallCard/smallCard';
import Router from 'next/router';

import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const myDonations = props => {
    console.log('user data', props.userData);
    // let userData = props.userData;
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        if (props.userData.id)
            axios
                .post(publicRuntimeConfig.API_URL + '/donations/getUserDonations', {
                    userId: props.userData.id
                })
                .then(res => {
                    if (res.data.status === 200) {
                        // console.log("my donations: ", res.data);
                        // console.log("userData: ", props.userData);
                        setDonations(res.data.donations);
                    }
                })
                .catch(err => console.log(err));
    }, [props.userData.id]);

    return (
        <>
            <div className="px-4  lg:px-8 xl:px-0 mb-16">
                <div className=" justify-between">
                    <p className="block lg:text-3xl text-branding-color py-4 text-xl">
                        My Donations
                    </p>
                </div>

                <div className="grid gird-cols md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3 gap-x-2 lg:gap-x-8 gap-y-4  ">
                    {donations[0] ? (
                        donations.map((donation, index) => {
                            const handleProjectDetailsRoute = () => {
                                Router.push(`/project/[id]`, `/project/${donation.projectId}`);
                            };
                            return (
                                <div key={index} className="w-full">
                                    {donation.projectId ? (
                                        <div
                                            className="transform hover:scale-110  cursor-pointer"
                                            onClick={handleProjectDetailsRoute}>
                                            <SmallCard
                                                key={donation._id}
                                                imgSrc={donation.projectImage}
                                                text={donation.projectTitle}
                                                value={donation.donatedBCH}
                                            />
                                        </div>
                                    ) : (
                                        <SmallCard
                                            key={donation._id}
                                            imgSrc={donation.projectImage}
                                            text={donation.projectTitle}
                                            value={donation.donatedBCH}
                                        />
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No data</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default myDonations;
