import React, {useState} from 'react'
import {MDBAlert, MDBContainer, MDBRow} from "mdbreact";
import styles from './forgotPasswordForm.module.css'
import Link from "next/link";
import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig();
import axios from 'axios';
import Router from 'next/router';
import * as Swal from 'sweetalert2';
import {useFormik} from "formik";
import Warning from "../../utils/warning";

/**
 *  Validation Funciton
 * @param values
 * @returns {{}}
 */
const validate = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};


const forgotPasswordForm = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validate,
        onSubmit: values => {
            axios.post(publicRuntimeConfig.APP_URL + '/users/forgotPassword', values).then(response => {
                if (response.data.statusCode == 402) {
                    Swal.fire('Not Verified', response.data.status, 'error')
                } else if (response.data.statusCode == 401) {
                    Swal.fire('Auth Failed', response.data.status, 'error')
                } else if (response.status == 200) {
                   Swal.fire('Mail Sent',"Please check your mail for further instructions on resetting your password");
                } else {
                    Swal.fire('Whoops..', 'Something Went Wrong', 'error');
                }
            }).catch(err => {
                Swal.fire('Whoops..', 'Something Went Wrong', 'error');
                console.log(err)
            });
        }
    });
    return (
        <div className="bg-login-bg bg-opacity-40">
            <div className="py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-2/7 sm:w-full md:w-3/7 xl:w-2/7 items-center justify-center md:mx-auto  ">
                <div className="mx-auto p-4 bg-white shadow-md rounded-2xl">
                <h2 className="pt-0 pb-4  text-branding-text-color text-2xl uppercase text-center">Enter Email</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4 text-outline-color">
                                <input type="email" name="email" id="email"
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.email}
                                       className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                                   rounded-2xl border-outline-color outline-outline-color
                                    ring-border-color focus:ring-2 focus:ring-purple-300
                                   focus:border-purple-300  focus:outline-none
                                    border-1 focus:border-0  bg-transparent ..."
                                       placeholder="Email"/>
                                {formik.touched.email && formik.errors.email ? (
                                    <Warning
                                        message={formik.errors.email}
                                   />
                                ) : null}
                            </div>
                            <button type="submit" className="w-full text-white rounded-2xl h-10 uppercase bg-outline-color text-lg hover:shadow-xl shadow-md  mb-6 mt-6">Reset Password</button>
                        </form>

                    </div>
                </div>
        </div>
    );
};
export default forgotPasswordForm;
