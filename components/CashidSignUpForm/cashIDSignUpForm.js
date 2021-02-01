import React, {useState} from 'react'
import {MDBAlert, MDBContainer, MDBRow} from "mdbreact";
import styles from './cashIDSignupForm.module.css'
import Link from "next/link";
import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig();
import axios from 'axios';
import Router from 'next/router';
import * as Swal from 'sweetalert2';
import {useFormik} from "formik";
import {useRouter} from "next/router";
import {useSelector,useDispatch} from "react-redux";

const validate = values => {
    const errors = {};

    if (!values.username) {
        errors.username = 'Required';
    } else if (!(values.username.length >= 4 && values.username.length < 50)) {
        errors.username = 'Must be greater then 4 and less than 50';
    }
    else if (!/[a-z A-Z0-9\\_\\"]+$/.test(values.username)) {
        errors.username = 'Can only contain numbers,letters and underscore';
    }
    if(!values.select){
        errors.select = 'Required';
    }


    return errors;
};


const cashIDSignUpForm = () => {
    const dispatch = useDispatch();
    const cashID = useSelector(state=>state.cashID);
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            email: '',
            username:'',
            select:'Regular'
        },
        validate,
        onSubmit: values => {
            axios.post(publicRuntimeConfig.APP_URL + '/users/cashid/signUp', {
                data:{
                    values:values,
                    cashID: cashID
                }
            }).then(response => {
                if (response.data.statusCode == 402) {
                    Swal.fire('Not Verified', response.data.status, 'error')
                } else if (response.data.statusCode == 401) {
                    Swal.fire('Auth Failed', response.data.status, 'error')
                } else if (response.data.statusCode == 200) {
                    dispatch({type:'CLEAR_CASHID'});
                    Router.push('/login');
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
                        <h6 className={`${styles.hpLoginHead} text-uppercase text-center`}>Register with CASHID</h6>
                        <p>Provide a username and we will link your username with your cashid. You can then simply login using Cashid.
                        </p>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                <input type="email" name="email" id="email"
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.email}
                                       className={`${styles.hpLoginFormControl} form-control`} placeholder="Email (Optional)"/>
                                {formik.touched.email && formik.errors.email ? (
                                    <MDBAlert color="danger" >
                                        {formik.errors.email}
                                    </MDBAlert>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <input    onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.username}
                                          id="username" type="username" name="username"
                                          className={`${styles.hpLoginFormControl} form-control`} placeholder="User Name"/>
                                {formik.touched.username && formik.errors.username ? (
                                    <MDBAlert color="danger" >
                                        {formik.errors.username}
                                    </MDBAlert>
                                ) : null}
                            </div>
                            <select className={`${styles.hpLoginFormControl} browser-default custom-select`}
                                    type="select" id="select" name="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.select}
                            >
                                <option disabled selected hidden>Sponsor Or Regular</option>
                                <option value="Regular">Regular</option>
                                <option value="Sponsor">Sponsor</option>
                            </select>
                            {formik.touched.select && formik.errors.select ? (
                                <MDBAlert color="danger" >
                                    {formik.errors.select}
                                </MDBAlert>
                            ) : null}
                            <button type="submit" className={`${styles.hpBtnLogin} btn`}>REGISTER</button>
                        </form>

                    </div>
                </div>
            </MDBRow>
        </MDBContainer>
    );
};
export default cashIDSignUpForm;
