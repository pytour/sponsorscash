import React from "react";
import PropTypes from "prop-types";
import Header from "../Header";
import Footer from '../Footer/Footer'


const Layout = ({ children, isPrivatePage }) => (
    <>
    <Header  isPrivatePage={isPrivatePage} />
    {children}
    <Footer />
    </>
);

// Layout.propTypes = {
//   children: PropTypes.node.isRequired
// };

export default Layout;
