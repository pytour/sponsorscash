import React from 'react'
import {withRedux} from "../lib/redux";
import Layout from "../components/Layout";
import CashIDSignUpForm from '../components/CashidSignUpForm/cashIDSignUpForm'

const cashIDSignUp = () => {
    return(
        <Layout>
            <CashIDSignUpForm/>
        </Layout>
    );
};

export default withRedux(cashIDSignUp);
