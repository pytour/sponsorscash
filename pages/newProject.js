import React from 'react';
import { withRedux } from '../lib/redux';
import Layout from '../components/Layout/Layout';
import NewProjectForm from '../components/NewProjectForm/newProjectForm';

const newProject = () => {
    return (
        <Layout>
            <NewProjectForm />
        </Layout>
    );
};

export default withRedux(newProject);
