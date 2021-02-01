import React from "react";
import { withRedux } from "../lib/redux";
import Layout from "../components/Layout/Layout";
import ResetPasswordForm from '../components/ResetPasswordForm/resetPasswordForm'
const resetPassword = () => {
    return (
        <Layout>
            <ResetPasswordForm/>
        </Layout>
    );
};

export default withRedux(resetPassword);
