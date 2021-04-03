import React, { useEffect } from 'react';
import { withRedux } from '../lib/redux';
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/LoginForm/LoginForm';
import { useSelector } from 'react-redux';;
import Router, { useRouter } from 'next/router';

const login = () => {
    const router = useRouter();
    const token = useSelector(state => state.token);
    const username = useSelector(state => state.username);
    useEffect(() => {
        if (token && '/login' === router.pathname) {
            Router.push('/privateAccount', '/' + username);
        }
    }, []);


    if(!token) {
        return (
            <Layout>
                <LoginForm/>
            </Layout>
        );
    }
    else return null;
};

export default withRedux(login);
