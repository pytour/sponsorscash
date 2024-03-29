import React, { useEffect, useState } from 'react';
import { withRedux } from '../../lib/redux';
import Layout from '../../components/Layout/Layout';
import ProjectBio from '../../components/ProjectBio/projectBio';
import TabNavigation from '../../components/TabNavigation/Tabs';
import axios from 'axios';
import DotLoader from 'react-spinners/DotLoader';
import getConfig from 'next/config';
import AdsManagerCampaigns from '../../components/AdsManager/AdsManagerCampaigns';

const { publicRuntimeConfig } = getConfig();

const project = props => {
    const [project, setProject] = useState({});
    const [donations, setDonations] = useState();
    const [popularProjects, setPopularProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [boostedProjects, setBoostedProjects] = useState([]);
    useEffect(() => {
        axios
            .get(publicRuntimeConfig.API_URL + '/project/getCompletedProjects', {
                params: {
                    campaignsLimit: 6
                }
            })
            .then(res => {
                setCompletedProjects(res.data.projects);
            })
            .catch(err => console.log(err));

        axios
            .get(publicRuntimeConfig.ADS_SERVER_URL + '/api/ads/getAds')
            .then(res => {
                const resProj = res.data.ads;
                setBoostedProjects(resProj);
            })
            .catch(err => console.log(err));
    }, []);

    // TODO:
    // Need to use setInterval to check for new deposits each 6 seconds
    // If new dep found update FUNDED value on API /checkGoalStatus
    useEffect(() => {
        const interval = setInterval(() => {
            if (props.cashAddress && !props.project.isTransactionCleared)
                axios
                    .get(
                        'https://insomnia.fountainhead.cash/v1/address/history/' + props.cashAddress
                    )
                    .then(res => {
                        if (res.data.success) {
                            // Get all tx from network
                            const networkTxs = res.data.txs.map(el => el.tx_hash);
                            let isThereNewTx;
                            console.log('Donations Network', networkTxs.length);

                            // Get saved txs
                            if (
                                donations &&
                                donations.length > 0 &&
                                networkTxs &&
                                networkTxs.length > 0
                            ) {
                                // Compare with saved
                                // console.log('Donations Saved', donations.length);
                                let savedDonationsTxs = donations.map(el => el.txId);
                                for (const tx of networkTxs) {
                                    if (!savedDonationsTxs.includes(tx)) {
                                        isThereNewTx = true;
                                    }
                                }
                            } else if (networkTxs && networkTxs.length > 0) {
                                // console.log('First transactions');
                                isThereNewTx = true;
                                // First transactions
                                // checkFunds
                                // Update UI
                            }

                            if (isThereNewTx) {
                                // IF there new txs:
                                // checkFunds
                                // console.log('///// There is new transaction on network!!!');
                                axios
                                    .post(publicRuntimeConfig.API_URL + '/project/checkFunds', {
                                        projectID: props.project._id
                                    })
                                    .then(funds => {
                                        if (funds.data.status === 200) {
                                            // console.log('checkFunds:', funds.data.funded);
                                            let fundedVal =
                                                funds.data.funded > props.project.funded
                                                    ? funds.data.funded
                                                    : props.project.funded;
                                            let updatedProject = JSON.parse(
                                                JSON.stringify(project)
                                            );
                                            updatedProject.funded = fundedVal;
                                            console.log('updatedProject:', updatedProject);
                                            setProject(updatedProject);
                                            // setFunded(fundedVal);
                                        } else if (funds.data.status === 400) {
                                            console.log('Error at checkFunds:', funds.data.message);
                                            // setFunded(props.project.funded);
                                        }
                                        // Update UI, Get donations
                                        axios
                                            .post(
                                                publicRuntimeConfig.API_URL +
                                                    '/donations/getProjectDonations',
                                                {
                                                    projectId: props.project._id
                                                }
                                            )
                                            .then(res => {
                                                if (res.data.status === 200) {
                                                    // console.log("sponsorPanel/last donors:: donations: ", res.data);
                                                    let sortedDonations = res.data.donations.sort(
                                                        (a, b) => b.donatedBCH - a.donatedBCH
                                                    );
                                                    setDonations(sortedDonations);
                                                }
                                            })
                                            .catch(err => console.log(err));
                                    })
                                    .catch(err => {
                                        console.log('Error at checkFunds: ', err.message);
                                        // setFunded(props.project.funded);
                                    });
                            }
                        }
                    })
                    .catch(err => console.log(err));
        }, 6000);
        return () => clearInterval(interval);
    }, [props.project, donations]);

    // Set initial data: project && donations
    useEffect(() => {
        let projectId = props.project._id;

        if (projectId) {
            setProject(props.project);
            axios
                .post(publicRuntimeConfig.API_URL + '/donations/getProjectDonations', {
                    projectId: projectId
                })
                .then(res => {
                    if (res.data.status === 200) {
                        // console.log("sponsorPanel/last donors:: donations: ", res.data);
                        let sortedDonations = res.data.donations.sort(
                            (a, b) => b.donatedBCH - a.donatedBCH
                        );
                        setDonations(sortedDonations);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [props.project]);

    return (
        <Layout props={props}>
            {props.project && props.project._id ? (
                <>
                    <div className=" max-w-screen-xl grid grid-cols-12 gap-2  px-4 lg:px-4 xl:px-4 mx-auto ">
                        <div className="lg:col-span-9 col-span-12 lg:order-1 order-1">
                            <ProjectBio project={project} projCashID={props.cashAddress} />
                            <div className="border-t-2 my-4">
                                <div className=" max-w-screen-xl grid grid-cols-12 gap-2  px-4 lg:px-4 xl:px-4 mx-auto ">
                                    <div className="lg:col-span-12 col-span-12 lg:order-1 order-2">
                                        <TabNavigation
                                            projectCreator={props.projectCreator}
                                            project={props.project}
                                            donations={donations}
                                        />
                                    </div>
                                    {/*<div className="lg:col-span-4 col-span-12 lg:order-2 order-1 ">*/}
                                    {/*<AdsManagerCampaigns grid={false} boostedProjects={completedProjects.slice(0,3)}/>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3 col-span-12 lg:order-2 order-2 ">
                            <AdsManagerCampaigns grid={false} boostedProjects={boostedProjects} />
                        </div>
                    </div>
                </>
            ) : props.error ? (
                <div className=" max-w-screen-xl p-12 lg:p-46 mx-auto ">
                    <div className="object-center ">
                        <div className="group rounded-sm h-32 lg:h-96 overflow-hidden shadow-sm ">
                            <div className="p-4 m-4 items-middle text-center ">
                                Error 404: Page not found.
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-screen-xl mx-auto items-center text-center p-40">
                    <div className="flex flex-wrap content-center h-48 ">
                        <div>
                            <div className="p-5 object-center">
                                <DotLoader size={50} color={'#7d73c3'} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

project.getInitialProps = async ({ query }) => {
    const { id } = query;

    const { publicRuntimeConfig } = getConfig();

    let project, projectCreator, cashAddress;

    let res;
    try {
        res = await axios.get(publicRuntimeConfig.API_URL + '/project/getSingleProject/' + id);
    } catch (error) {
        return { error: 404 };
    }

    if (res.data.status === 200) {
        project = res.data.project;
        cashAddress = res.data.cashAddress;
        projectCreator = {
            creator: res.data.creator,
            avatar: res.data.avatar,
            username: res.data.username
        };
    } else {
        return { error: 404 };
    }

    return {
        project: project,
        projectCreator: projectCreator,
        cashAddress: cashAddress
    };
};

export default withRedux(project);
