import React, { useState } from 'react';
import Link from 'next/link';
import getConfig from 'next/config';
import axios from 'axios';
import Router from 'next/router';
import * as Swal from 'sweetalert2';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import Warning from '../../utils/warning';

const { publicRuntimeConfig } = getConfig();

const validate = values => {
    const errors = {};
    const deprecateUsernames = [
        '_app',
        'index',
        'login',
        'signin',
        'about',
        'contactUs',
        '[userpublicpage]',
        '[id]',
        '[sponsorPublic]',
        'cashIDAssociation',
        'cashIDSignUp',
        'forgotPassword',
        'newProject',
        'privateAccount',
        'resetPassword',
        'sponsorAccount',
        'undefined',
        'deleted',
        'edit',
        'editCampaign',
        'campaign',
        'error'
    ];
    if (!values.username) {
        errors.username = 'Required';
    } else if (!(values.username.length >= 4 && values.username.length < 50)) {
        errors.username = 'Must be greater then 4 and less than 50';
    } else if (deprecateUsernames.includes(values.username)) {
        errors.username = 'Please try another username';
    } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
        errors.username = 'Can only contain numbers,letters and underscore (Example: john_doe1)';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (!(values.password.length >= 8 && values.password.length < 200)) {
        errors.password = 'Must be greater then 8 and less than 200';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.select) {
        errors.select = 'Required';
    }

    return errors;
};

const signinForm = () => {
    const [cashID, setCashID] = useState('');
    const dispatch = useDispatch();

    const isAccountAssociated = cashID => {
        if (cashID !== undefined) {
            return axios
                .post(publicRuntimeConfig.APP_URL + '/users/cashid/associated', {
                    cashID: cashID
                })
                .then(res => {
                    return res.data;
                })
                .catch(err => err);
        }
    };

    const signUpCashId = async (cashID, res) => {
        if (res) {
            let accountAssociation = await isAccountAssociated(cashID);
            if (!accountAssociation.isAssociated) {
                // Redirect to account association page
                if (cashID) {
                    dispatch({ type: 'SET_CASHID', payload: cashID });
                    Router.push('/cashIDSignUp');
                }
            } else {
                // Log In User
                dispatch({ type: 'AUTHENTICATE', payload: accountAssociation.token });
                if (accountAssociation.accountType === 'Regular') {
                    Router.push('/privateAccount', '/' + accountAssociation.username);
                } else {
                    Router.push('/sponsorAccount', '/' + accountAssociation.username);
                }
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            name: '',
            email: '',
            password: '',
            select: 'Regular'
        },
        validate,
        onSubmit: values => {
            axios
                .post(publicRuntimeConfig.APP_URL + '/users/signup', values)
                .then(response => {
                    if (response.status == 201 || response.status == 200) {
                        Swal.fire(
                            'Verify Email',
                            `Please check your inbox for verification email(it could be in spam folder)`,
                            'success'
                        );
                        Router.push('/login');
                    } else {
                        Swal.fire('Whoops..', 'Something Went Wrong', 'error');
                    }
                })
                .catch(err => {
                    Swal.fire('Whoops..', 'Something Went Wrong', 'error');
                    console.log(err);
                });
        }
    });
    return (
        <div className="bg-login-bg bg-opacity-40">
            <div className="py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-2/7 sm:w-full md:w-3/7 xl:w-2/7 items-center justify-center md:mx-auto  ">
                <div className="mx-auto p-4 bg-white shadow-md rounded-2xl">
                    <form onSubmit={formik.handleSubmit}>
                        <h2 className="pt-0 pb-4  text-outline-color text-2xl uppercase text-center">
                            sign up
                        </h2>

                        <div className="mb-4 text-outline-color">
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                                id="username"
                                type="username"
                                name="username"
                                className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent ..."
                                placeholder="username"
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <Warning message={formik.errors.username} />
                            ) : null}
                        </div>
                        <div className=" mb-4 text-outline-color">
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                type="name"
                                name="name"
                                id="name"
                                className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent..."
                                placeholder="Name"
                            />
                        </div>
                        <div className="mb-4 text-outline-color">
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                type="email"
                                name="email"
                                id="email"
                                className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent..."
                                placeholder="Email"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <Warning message={formik.errors.email} />
                            ) : null}
                        </div>
                        <div className="mb-4 text-outline-color">
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                type="password"
                                name="password"
                                id="password"
                                className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent..."
                                placeholder="Password"
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <Warning message={formik.errors.password} />
                            ) : null}
                        </div>

                        {formik.touched.select && formik.errors.select ? (
                            <Warning message={formik.errors.select} />
                        ) : null}

                        <button
                            type="submit"
                            className="w-full text-white rounded-2xl h-10 uppercase bg-login-bg bg-opacity-75 text-lg hover:shadow-xl shadow-md  mb-6 mt-6">
                            REGISTER
                        </button>
                    </form>
                    <div className="border-t-1 border-outline-color text-gray-500 text-center pt-4 ">
                        <p className="mb-0">
                            Have an Account?
                            <Link href="/login">
                                <a>
                                    <ins className="text-outline-color"> Log in</ins>
                                </a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default signinForm;
