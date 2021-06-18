import React, { useEffect, useState } from 'react';
import { withRedux } from '../lib/redux';
import Layout from '../components/Layout/Layout';
import ProfileCard from '../components/PA-ProfileCard/profileCard';
import Card from '../components/Card/Card';
import Router, { useRouter } from 'next/router';
import getConfig from 'next/config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DotLoader from 'react-spinners/DotLoader';
import NoRouteComponent from '../components/noRouteComponent';

const { publicRuntimeConfig } = getConfig();

const publicAccount = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({});
    const [userProjects, setUserProjects] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.token);
    const username = useSelector(state => state.username);
    useEffect(() => {
        if (token && username === router.query.userpublicpage) {
            setLoading(false);
            Router.push('/privateAccount', '/' + username);
        } else {
            setLoading(true);
            axios
                .get(
                    publicRuntimeConfig.API_URL +
                        '/users/getUserProfile/' +
                        router.query.userpublicpage
                )
                .then(res => {
                    console.log('..check', res.status);
                    if (res.status === 201) {
                        setUserData(null);
                    } else {
                        setUserData(res.data);
                    }
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        }
    }, []);

    const projectsList = () => {
        let projArr = [];

        if (userData && userData.projects)
            axios
                .post(publicRuntimeConfig.API_URL + '/project/getArrayOfProjects/', {
                    projects: userData.projects
                })
                .then(res => {
                    projArr = res.data.projects;

                    setUserProjects(projArr);
                })
                .catch(err => console.log(err));
    };

    if (typeof window !== 'undefined' && loading) {
        return (
            <div className="flex h-screen">
                <div className="m-auto">
                    <DotLoader size={50} color={'#7d73c3'} />
                </div>
            </div>
        );
    }

    if (!userData) {
        return <NoRouteComponent />;
    }

    if (loading === false && userData) {
        return (
            <Layout>
                <ProfileCard userData={userData} showEditButton={false} />
                <div className="container max-w-screen-xl px-4 md:px-.5 lg:px-.5 xl:px.5 mb-8 mx-auto">
                    <h2 className="block md:text-3xl text-2xl text-branding-color p-2 mt-8 mb-4">
                        Completed Campaigns
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-20 md:gap-y-8 gap-x-16 gap-y-3 relative">
                        {!userProjects && <DotLoader size={50} color={'#7d73c3'} />}
                        {userProjects
                            ? userProjects.map(project => {
                                  let projImage = project.images[0]
                                      ? publicRuntimeConfig.API_URL +
                                        '/media/project/' +
                                        project.images[0]
                                      : publicRuntimeConfig.API_URL + '/media/project/default.jpg';
                                  let linkSlug = `/project/${project._id}`;

                                  return (
                                      <div className="mb-2" key={project._id}>
                                          <div className="transform scale-100 hover:scale-105">
                                              <Card
                                                  key={project._id}
                                                  tag={project.category}
                                                  description={project.description}
                                                  title={project.title}
                                                  funded={project.funded}
                                                  goal={project.goal}
                                                  imageSrc={projImage}
                                                  linkSlug={linkSlug}
                                                  nested={true}
                                              />
                                          </div>
                                      </div>
                                  );
                              })
                            : projectsList()}
                    </div>
                </div>
            </Layout>
        );
    } else return <NoRouteComponent />;
};

export default withRedux(publicAccount);
