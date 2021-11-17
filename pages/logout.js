import React, { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import DotLoader from 'react-spinners/DotLoader';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import { withRedux } from '../lib/redux';

const LogOut = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'DEAUTHENTICATE' });
        Router.push('/login');
    }, []);

    return (
        <Layout>
            <DotLoader size={50} color={'#7d73c3'} />
        </Layout>
    );
};

export default withRedux(LogOut);
