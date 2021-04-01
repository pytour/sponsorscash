import React from 'react';
import Header from '../Header';
import Footer from '../Footer/Footer';
import PropTypes from 'prop-types';

const Layout = ({ children, isPrivatePage }) => (
    <>
        <Header isPrivatePage={isPrivatePage} />
        {children}
        <Footer />
    </>
);

Layout.propTypes = {
    children: PropTypes.element,
    isPrivatePage: PropTypes.bool
};

export default Layout;
