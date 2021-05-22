import React, { useEffect, useState } from 'react';
import Sponsors from './sponsors';

// import axios from "axios";
// import getConfig from "next/config";
// const { publicRuntimeConfig } = getConfig();

const sponsorPanel = props => {
    // TODO fetch data for Last Sponsors tab
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        if (props.donations) {
            setDonations(props.donations);
            // console.log('last donors tab:', donations);
            props.onChangeDonationCount(donations.length);
        }
    }, [props.donations]);

    return (
        <>
            <div>
                <div className="py-4 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 lg:gap-8 md:px-4">
                    {donations ? (
                        donations.map(el => {
                            if (el.name) {
                                return (
                                    <div>
                                        <Sponsors
                                            key={el._id}
                                            avatar={el.userImage}
                                            name={el.name}
                                            username={el.username}
                                            donation={el.donatedBCH + ' BCH'}
                                            tx={el.txId}
                                            date={el.date}
                                            comment={el.comment}
                                        />
                                    </div>
                                );
                            } else {
                                //Anonymous donation
                                return (
                                    <div>
                                        <Sponsors
                                            key={el._id}
                                            avatar={el.userImage}
                                            name="Anonymous"
                                            username={el.username}
                                            donation={el.donatedBCH + ' BCH'}
                                            tx={el.txId}
                                            date={el.date}
                                            comment={el.comment}
                                        />
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <p className="text-center text-xl">Loading...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default sponsorPanel;
