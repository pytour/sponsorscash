import React from 'react';
import getConfig from 'next/config';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import * as Swal from 'sweetalert2';
import { useFormik } from 'formik';
import Warning from '../../utils/warning';

const { publicRuntimeConfig } = getConfig();

const validate = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (!values.password) {
        errors.password = 'Required';
    } else if (!(values.password.length >= 8 && values.password.length < 200)) {
        errors.password = 'Must be greater then 8 and less than 200';
    }

    return errors;
};

const resetPasswordForm = () => {
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate,
        onSubmit: values => {
            axios
                .post(publicRuntimeConfig.API_URL + '/users/resetPassword', {
                    data: {
                        values: values,
                        token: router.query.token
                    }
                })
                .then(response => {
                    if (response.data.statusCode == 402) {
                        Swal.fire('Not Verified', response.data.status, 'error');
                    } else if (response.data.statusCode == 401) {
                        Swal.fire('Auth Failed', response.data.status, 'error');
                    } else if (response.status == 200) {
                        Router.push('/privateAccount');
                    } else {
                        console.log('in else');
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
                    <h2 className="pt-0 pb-4  text-branding-text-color text-2xl uppercase text-center">
                        Enter Email and New Password to Reset
                    </h2>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4 text-outline-color">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color
                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent ..."
                                placeholder="Email"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <Warning message={formik.errors.email} />
                            ) : null}
                        </div>
                        <div className="mb-4 text-outline-color">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color
                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent ..."
                                placeholder="Password"
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <Warning message={formik.errors.password} />
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white rounded-2xl h-10 uppercase bg-outline-color text-lg hover:shadow-xl shadow-md  mb-6 mt-6">
                            Save New Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default resetPasswordForm;
