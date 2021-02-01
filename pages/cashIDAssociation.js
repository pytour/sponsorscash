import React from 'react'
import {withRedux} from "../lib/redux";
import Layout from "../components/Layout";
import CashidAssociationForm from '../components/CashIDAssociationForm/cashIDAssociationForm'

const cashIDAssociation = () => {
    return(
            <Layout>
               <CashidAssociationForm/>
            </Layout>
    );
};

export default withRedux(cashIDAssociation);
