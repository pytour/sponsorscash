import React, { useEffect, useState } from 'react';
import { withRedux } from '../lib/redux';
import Layout from '../components/Layout/Layout';
import ProfileCard from '../components/PA-ProfileCard/profileCard';
import WideCard from '../components/PA-WideCard/wideCard';
import MyDonations from '../components/MyDonations/myDonations';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import getConfig from 'next/config';
import DotLoader from 'react-spinners/DotLoader';

const { publicRuntimeConfig } = getConfig();
const privateAccount = () => {
    const dispatch = useDispatch();
    const projects = useSelector(state => {
        return state.projects;
    });

    const [userData, setUserData] = useState({});
    // const [projects, setProjects] = useState([]);
    const token = useSelector(state => state.token);
    useEffect(() => {
        if (!token) {
            Swal.fire('Please Login first', 'error', 'error');
            Router.push('/login');
        } else {
            axios
                .get(publicRuntimeConfig.APP_URL + '/users/getUserProfile', {
                    headers: { Authorization: 'Bearer ' + token }
                })
                .then(res => {
                    console.log(res.data);
                    setUserData(res.data);
                })
                .catch(err => console.log(err));
        }
    }, []);

    useEffect(() => {
        axios
            .get(publicRuntimeConfig.APP_URL + '/project/getProjects', {
                headers: { Authorization: 'Bearer ' + token }
            })
            .then(res => {
                if (res.data.status === 200) {
                    const resProjects = res.data.projects;
                    dispatch({ type: 'UPDATE_PROJECTS', payload: resProjects });
                    // setProjects(projects);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const renderProjects = () => {
        return projects.map((project, index) => {
            if (project.status !== 'CANCELED')
                return (
                    <div key={index}>
                        <WideCard
                            dispatch={dispatch}
                            imgSrc={project.images[0]}
                            title={project.title}
                            category={project.category}
                            goal={project.goal}
                            fundingEnds={project.endTime}
                            funded={project.funded}
                            projectID={project._id}
                        />
                    </div>
                );
        });
    };

    return (
        <Layout isPrivatePage={true}>
            <ProfileCard userData={userData} showEditButton={true} />
            <div className="container my-4 max-w-screen-xl mx-auto  px-4 md:px-8  lg:px-8 xl:px-2">
                <div className="flex   justify-between items-baseline px-4 md:px-0">
                    <p className="inline-block lg:text-3xl text-branding-color py-4 text-xl ">
                        My Projects
                    </p>
                    <a
                        className="cursor-pointer bg-white border-branding-text-color border-1 px-4 py-1 rounded-full pr-2 transform hover:scale-110 "
                        type="button"
                        onClick={() => {
                            Router.push('/newProject');
                        }}>
                        New Campaign
                    </a>
                </div>

                <div className=" my-4 max-w-screen-xl mx-auto px-2">
                    {projects ? (
                        renderProjects()
                    ) : (
                        <div className="flex h-screen">
                            <div className="m-auto">
                                <DotLoader size={50} color={'#7d73c3'} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="my-4 max-w-screen-xl mx-auto px-2">
                <MyDonations userData={userData} />
            </div>
        </Layout>
    );
};

export default withRedux(privateAccount);
