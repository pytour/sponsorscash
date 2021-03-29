import React from 'react';
import { withRedux } from '../lib/redux';
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/LoginForm/LoginForm';
const login = () => {
    return (
        <Layout>
            <LoginForm />
        </Layout>
    );
};

export default withRedux(login);
