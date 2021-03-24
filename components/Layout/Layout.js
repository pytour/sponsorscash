import React from "react";
import Header from "../Header";
import Footer from '../Footer/Footer'


const Layout = ({ children, isPrivatePage }) => (
    <>
    <Header  isPrivatePage={isPrivatePage} />
    {children}
    <Footer />
    </>
);


export default Layout;
