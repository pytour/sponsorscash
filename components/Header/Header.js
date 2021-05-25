//import Link from "next/link";
import NavbarPage from '../UI/Navbar';
import Router from 'next/router';
import React from 'react';
import { detectAnyAdblocker } from 'just-detect-adblock';
import Swal from 'sweetalert2';

const Header = ({ isPrivatePage }) => {
    Router.events.on('routeChangeComplete', () => {
        window.scrollTo(0, 0);
    });

    // Check wheather user using AdBlock or not
    // if yes then show modal "Please turn off AdBlock"

    const checkAdBlock = () => {
        detectAnyAdblocker().then(detected => {
            if (detected) {
                // an adblocker is detected
                console.log(detected);
                Swal.fire({ title: 'Please turn off AdBlock', icon: 'warning' });
            }
        }).catch(err => { console.log(err); });
    };

    return (
        <header prefix="og: http://ogp.me/ns#">
            {checkAdBlock()}
            <NavbarPage isPrivatePage={isPrivatePage} />
        </header>
    );
};

export default Header;
