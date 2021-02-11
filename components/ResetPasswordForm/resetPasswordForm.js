import React from 'react'
import {MDBAlert, MDBContainer, MDBRow} from "mdbreact";
import styles from './resetPasswordForm.module.css'
import getConfig from 'next/config'
import axios from 'axios';
import Router, {useRouter} from 'next/router';
import * as Swal from 'sweetalert2';
import {useFormik} from "formik";

const {publicRuntimeConfig} = getConfig();

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
            password:''
        },
        validate,
        onSubmit: values => {
            axios.post(publicRuntimeConfig.APP_URL + '/users/resetPassword', {
                data:{
                    values:values,
                    token:router.query.token
                }
            }).then(response => {

                if (response.data.statusCode == 402) {
                    Swal.fire('Not Verified', response.data.status, 'error')
                } else if (response.data.statusCode == 401) {
                    Swal.fire('Auth Failed', response.data.status, 'error')
                } else if (response.status == 200) {
                    Router.push('/privateAccount');
                } else {
                    console.log("in else");
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
                        <h6 className={`${styles.hpLoginHead} text-uppercase text-center`}>Enter Email and New Password to Reset</h6>
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
                            <div className="form-group">
                                <input type="password" name="password" id="password"
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.password}
                                       className={`${styles.hpLoginFormControl} form-control`} placeholder="Password"/>
                                {formik.touched.password && formik.errors.password ? (
                                    <MDBAlert color="danger" >
                                        {formik.errors.password}
                                    </MDBAlert>
                                ) : null}
                            </div>
                            <button type="submit" className={`${styles.hpBtnLogin} btn`}>Save New Password</button>
                        </form>

                    </div>
                </div>
            </MDBRow>
        </MDBContainer>
    );
};
export default resetPasswordForm;
