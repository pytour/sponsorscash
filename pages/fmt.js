import React from "react";
import { withRedux } from "../lib/redux";
import Layout from "../components/Layout/Layout";
import PredictionCharts from '../components/PredictionCharts/PredictionCharts'

const stats = () => {
    return (
        <Layout>
            <PredictionCharts/>
        </Layout>
    );
};

export default withRedux(stats);