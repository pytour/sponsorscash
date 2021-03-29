//import Link from "next/link";
import NavbarPage from '../UI/Navbar';
import Router from 'next/router';
import React from 'react';

const Header = ({ isPrivatePage }) => {
    Router.events.on('routeChangeComplete', () => {
        window.scrollTo(0, 0);
    });
    return (
        <header prefix="og: http://ogp.me/ns#">
            <NavbarPage isPrivatePage={isPrivatePage} />
        </header>
    );
};

export default Header;
