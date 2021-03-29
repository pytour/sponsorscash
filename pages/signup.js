import React from 'react';
import { withRedux } from '../lib/redux';
import Layout from '../components/Layout/Layout';
import SigninForm from '../components/SigninForm/SigninForm';
const signup = () => {
    return (
        <Layout>
            <SigninForm />
        </Layout>
    );
};

export default withRedux(signup);
