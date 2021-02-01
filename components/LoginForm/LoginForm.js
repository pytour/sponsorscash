import React, {useState,useEffect} from 'react'
import {MDBAlert, MDBContainer, MDBRow} from "mdbreact";
import styles from './loginform.module.css'
import Link from "next/link";
import getConfig from 'next/config'
import { useDispatch, useSelector } from "react-redux";
import CashId from "../CashId/Cashid";

const {publicRuntimeConfig} = getConfig();
import axios from 'axios';
import Router, { useRouter }  from 'next/router';
import * as Swal from 'sweetalert2';
import {useFormik} from "formik";

const validate = values => {
    const errors = {};

    if (!values.password) {
        errors.password = 'Required';
    } else if (!(values.password.length >= 8 && values.password.length < 200)) {
        errors.password = 'Must be greater then 8 characters and less then 200 ';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};


const loginform = () => {
    const [serverResponse,setServerResponse] = useState({isAssociated:true});
    const [cashID,setCashID] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useSelector((state) => state.token);
    const username = useSelector((state) => state.username);
    useEffect(() => {
        console.log('Token:', token);
        console.log('Router:', router.pathname);
      if (token && '/login' === router.pathname) {
        Router.push("/privateAccount", "/" + username);
      }
    }, []);
    const isAccountAssociated = (cashID) => {
        if(cashID!==undefined){
            return axios.post(publicRuntimeConfig.APP_URL+'/users/cashid/associated',{cashID:cashID})
                .then(res=> {
                    return res.data;
                })
                .catch(err=>err);
        }
    };
    const loginCashId = async (cashID,res)=>{

        if(res){
           let accountAssociation =  await isAccountAssociated(cashID);
            if(!accountAssociation.isAssociated){
                // Redirect to account association page
                if(cashID){
                    dispatch({type:'SET_CASHID',payload:cashID});
                    Router.push('/cashIDAssociation')
                }

            }else{
                // Log In User
                dispatch({type:'AUTHENTICATE',payload:accountAssociation.token});
                if(accountAssociation.accountType === 'Regular') {
                    Router.push('/privateAccount', '/'+accountAssociation.username);
                } else {
                    Router.push('/sponsorAccount', '/sponsor/'+accountAssociation.username);
                }
            }
        }
    };
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate,
        onSubmit: values => {
            axios.post(publicRuntimeConfig.APP_URL + '/users/login', values).then(response => {
                if (response.data.statusCode == 402) {
                    Swal.fire('Not Verified', response.data.status, 'error')
                } else if (response.data.statusCode == 401) {
                    Swal.fire('Auth Failed', response.data.status, 'error')
                } else if (response.status == 200) {
                    dispatch({type:'AUTHENTICATE',payload:response.data});
                    localStorage.setItem('auth',response.data.token);
                    if(response.data.accountType === 'Regular') {
                        Router.push('/privateAccount', '/' + response.data.username);
                    }else {
                        Router.push('/sponsorAccount', '/sponsor/' + response.data.username);
                    }
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
                        <h2 className={`${styles.hpLoginHead} text-uppercase text-center`}>log in</h2>
                        <form onSubmit={formik.handleSubmit}>
                            {/* <CashId
                                domain="sponsor-cash.herokuapp.com"
                                path="/api/users/cashid/parse"
                                callback={loginCashId}
                            />
                            <p className={styles.hpSeparator}>or</p> */}
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
                            <div className="form-group mb-0">
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
                            <div className="form-group form-check d-flex justify-content-between">
                                <input type="checkbox" className="form-check-input" id="rememberMe"/>
                                <label style={{color: '#7d73c3'}} className="form-check-label" htmlFor="rememberMe">Remember
                                    me</label>
                                <Link href="/forgotPassword">
                                <a  className="form-check-link">
                                    <ins>Forgot password</ins>
                                </a>
                                </Link>
                            </div>
                            <button type="submit" className={`${styles.hpBtnLogin} btn`}>Log in</button>
                        </form>
                        <div className={styles.hpFormFooter}>
                            <p className="mb-0">New to <span className={styles.hpOrange}>fundme</span><span
                                className={styles.hpBlack}>.cash  </span>
                                <Link href="/signin">
                                    <a href="#">
                                        <ins style={{color: '#7d73c3'}}>SIGN UP</ins>
                                    </a>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </MDBRow>
        </MDBContainer>
    );
};
export default loginform;
