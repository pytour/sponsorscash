import React from 'react';
import { withRedux } from '../lib/redux';
import Layout from '../components/Layout/Layout';
//import ContactForm from '../components/ContactForm/ContactForm'

// Legacy code
// Complete or remove
const contactUs = () => {
    return <Layout>{/* <ContactForm/> */}</Layout>;
};

export default withRedux(contactUs);
