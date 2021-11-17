import React from 'react';
import Layout from '../components/Layout';
import { withRedux } from '../lib/redux';
import dynamic from 'next/dynamic';
import DotLoader from 'react-spinners/DotLoader';

const DynamicComponentWithCustomLoading = dynamic(() => import('../components/Home/HomePage'), {
    loading: () => (
        <div className="p-5 object-center">
            <DotLoader size={50} color={'#7d73c3'} />
        </div>
    )
});

const Home = () => {
    return (
        <div>
            <Layout>
                <DynamicComponentWithCustomLoading />
            </Layout>
        </div>
    );
};

export default withRedux(Home);
