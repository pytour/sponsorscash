import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { withRedux } from '../lib/redux';
import axios from 'axios';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import DotLoader from 'react-spinners/DotLoader';

const DynamicComponentWithCustomLoading = dynamic(
    () => import('../components/Home/HomePage'),
    { loading: () =>  <div className="p-5 object-center">
            <DotLoader size={50} color={'#7d73c3'} />
        </div> }
    )




const { publicRuntimeConfig } = getConfig();

const Home = () => {
    const [popularProjects, setPopularProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    useEffect(() => {
        axios
            .get(publicRuntimeConfig.APP_URL + '/project/getPopularProjects')
            .then(res => {
                const resProj = res.data.projects;
                setPopularProjects(resProj);
            })
            .catch(err => console.log(err));

        axios
            .get(publicRuntimeConfig.APP_URL + '/project/getCompletedProjects', {
                params: {
                    campaignsLimit: 6
                }
            })
            .then(res => {
                setCompletedProjects(res.data.projects);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <Layout>
                <DynamicComponentWithCustomLoading />
            </Layout>
        </div>
    );
};

export default withRedux(Home);
