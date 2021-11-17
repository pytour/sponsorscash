import React from 'react';
import Link from 'next/link';
import { withRedux } from '../../lib/redux';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const NavbarPage = props => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const name = useSelector(state => state.name);
    const username = useSelector(state => state.username);

    const loginButton = () => {
        if (isLoggedIn && username) {
            if (props.isPrivatePage && '/privateAccount' === router.pathname) {
                return (
                    <button
                        className="py-2 md:py-1   text-branding-text-color md:text-base text-sm border-none hover:border hover:rounded-md font-normal uppercase hover:text-branding-text-color-hover transition delay-400 duration-300 ease-in-out hover:translate-x-5 focus:translate-x-5"
                        onClick={() => {
                            dispatch({ type: 'DEAUTHENTICATE' });
                            Router.push('/login');
                        }}>
                        Log out{' '}
                    </button>
                );
            } else {
                return (
                    <button
                        className="py-2 md:py-1   text-branding-text-color border-none hover:border hover:rounded-md md:text-base text-sm font-normal uppercase hover:text-branding-text-color-hover transition delay-400 duration-300 ease-in-out hover:translate-x-5 focus:translate-x-5 "
                        onClick={() => {
                            Router.push('/privateAccount', '/' + username);
                        }}>
                        {' '}
                        {name || username}
                    </button>
                );
            }
        } else {
            return (
                <button
                    className="py-2 md:py-1 text-branding-text-color border-none hover:border hover:rounded-md md:text-base text-sm font-normal uppercase hover:text-branding-text-color-hover transition delay-400 duration-300 ease-in-out hover:translate-x-5 focus:translate-x-5 "
                    onClick={() => {
                        Router.push('/login');
                    }}>
                    {' '}
                    Login{' '}
                </button>
            );
        }
    };

    const warnMessage = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            html: `This site is in BETA, bugs may be present. Report bugs to
     <a href="https://t.me/sponsorschat"> our telegram chat </a>`
        });
    };

    const campaignButton = () => {
        if (isLoggedIn && username) {
            return (
                <button
                    className=" mr-4 py-2 md:py-1 text-branding-text-color md:text-base text-sm border-none hover:border hover:rounded-md font-normal uppercase hover:text-branding-text-color-hover transition delay-400 duration-300 ease-in-out hover:translate-x-5 focus:translate-x-5"
                    onClick={() => {
                        Router.push('/newProject');
                    }}>
                    {' '}
                    Start Campaign{' '}
                </button>
            );
        } else {
            return (
                <button
                    className=" mr-4 py-2 md:py-1  text-branding-text-color border-none hover:border hover:rounded-md md:text-base text-sm font-normal uppercase hover:text-branding-text-color-hover transition delay-400 duration-300 ease-in-out hover:translate-x-5 focus:translate-x-5 "
                    onClick={() => {
                        Router.push('/login');
                    }}>
                    {' '}
                    Start Campaign{' '}
                </button>
            );
        }
    };

    return (
        <>
            <nav className="relative  flex flex-wrap items-center justify-between px-2 md:py-3 py-2 navbar-expand-lg bg-branding-color mb-0 shadow-md">
                <div className="container max-w-screen-xl md:px-4 px-3 mx-auto flex flex-wrap items-center justify-between ">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link href="/">
                            <a className="">
                                <div className="p-1 m-1.5 rounded-lg">
                                    <img
                                        width="60"
                                        height="40"
                                        className="h-10 w-auto"
                                        src="/images/logo.png"
                                        alt="fund me cash logo"
                                    />
                                </div>
                            </a>
                        </Link>
                        <button
                            className="group transition duration-1000 ease-in-out text-branding-text-color cursor-pointer  leading-none px-3 py-0 rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}>
                            {navbarOpen === false ? (
                                <i className="transition duration-500 ease-in-out text-2xl stroke-current text-branding-text-color  fas fa-bars" />
                            ) : (
                                <i className="transition duration-500 ease-in-out stroke-current text-3xl text-branding-text-color  fas fa-times" />
                            )}
                        </button>
                    </div>
                    <div
                        className={
                            'lg:flex flex-grow items-center text-branding-text-color' +
                            (navbarOpen ? ' flex' : ' hidden')
                        }
                        id="example-navbar-danger">
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto ">
                            <li className="nav-item">{campaignButton()}</li>

                            <li className="nav-item">{loginButton()}</li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default withRedux(NavbarPage);
