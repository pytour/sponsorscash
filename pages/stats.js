import React from "react";
import { withRedux } from "../lib/redux";
import Layout from "../components/Layout/Layout";
import Stats from '../components/Stats/Stats'

const stats = () => {
    return (
        <Layout>
            <Stats/>
        </Layout>
    );
};

export default withRedux(stats);