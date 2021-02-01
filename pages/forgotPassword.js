import React from "react";
import { withRedux } from "../lib/redux";
import Layout from "../components/Layout/Layout";
import ForgotPasswordForm from '../components/ForgotPassword/forgotPasswordForm'
const forgotPassword = () => {
    return (
        <Layout>
            <ForgotPasswordForm/>
        </Layout>
    );
};

export default withRedux(forgotPassword);
