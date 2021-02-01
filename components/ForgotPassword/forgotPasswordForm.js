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
        <MDBContainer style={{maxWidth: '100%', backgroundColor: 'rgba(156, 180, 247, 0.4)'}}>
            <MDBRow>
                <div className="col-12 col-md-6 col-xl-4 mx-auto">
                    <div className={styles.hpLoginBody}>
                        <h2 className={`${styles.hpLoginHead} text-uppercase text-center`}>Enter Email</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                <input type="email" name="email" id="email"
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.email}
                                       className={`${styles.hpLoginFormControl} form-control`} placeholder="Email"/>
                                {formik.touched.email && formik.errors.email ? (
                                    <MDBAlert color="danger" >
                                        {formik.errors.email}
                                    </MDBAlert>
                                ) : null}
                            </div>
                            <button type="submit" className={`${styles.hpBtnLogin} btn`}>Reset Password</button>
                        </form>

                    </div>
                </div>
            </MDBRow>
        </MDBContainer>
    );
};
export default forgotPasswordForm;
