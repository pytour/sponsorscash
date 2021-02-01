import React, { useState } from "react";
import { MDBAlert, MDBContainer, MDBRow } from "mdbreact";
import styles from "./signin.module.css";
import Link from "next/link";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import axios from "axios";
import Router from "next/router";
import * as Swal from "sweetalert2";
import { useFormik } from "formik";
import CashId from "../CashId/Cashid";
import { useDispatch } from "react-redux";

const validate = (values) => {
  const errors = {};
  const deprecateUsernames = [
    "_app",
    "index",
    "login",
    "signin",
    "about",
    "contactUs",
    "[userpublicpage]",
    "[id]",
    "[sponsorPublic]",
    "cashIDAssociation",
    "cashIDSignUp",
    "forgotPassword",
    "newProject",
    "privateAccount",
    "resetPassword",
    "sponsorAccount",
    "undefined",
    "deleted",
    "edit",
    "editCampaign",
    "campaign",
    "error"
  ];
  if (!values.username) {
    errors.username = "Required";
  } else if (!(values.username.length >= 4 && values.username.length < 50)) {
    errors.username = "Must be greater then 4 and less than 50";
  } else if (deprecateUsernames.includes(values.username)) {
    errors.username = "Please try another username";
  } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
    errors.username = "Can only contain numbers,letters and underscore (Example: john_doe1)";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (!(values.password.length >= 8 && values.password.length < 200)) {
    errors.password = "Must be greater then 8 and less than 200";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.select) {
    errors.select = "Required";
  }

  return errors;
};

const signinForm = () => {
  const [cashID, setCashID] = useState("");
  const dispatch = useDispatch();

  const isAccountAssociated = (cashID) => {
    if (cashID !== undefined) {
      return axios
        .post(publicRuntimeConfig.APP_URL + "/users/cashid/associated", {
          cashID: cashID,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => err);
    }
  };

  const signUpCashId = async (cashID, res) => {
    if (res) {
      let accountAssociation = await isAccountAssociated(cashID);
      if (!accountAssociation.isAssociated) {
        // Redirect to account association page
        if (cashID) {
          dispatch({ type: "SET_CASHID", payload: cashID });
          Router.push("/cashIDSignUp");
        }
      } else {
        // Log In User
        dispatch({ type: "AUTHENTICATE", payload: accountAssociation.token });
        if (accountAssociation.accountType === "Regular") {
          Router.push("/privateAccount", "/" + accountAssociation.username);
        } else {
          Router.push("/sponsorAccount", "/" + accountAssociation.username);
        }
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      select: "Regular",
    },
    validate,
    onSubmit: (values) => {
      axios
        .post(publicRuntimeConfig.APP_URL + "/users/signup", values)
        .then((response) => {
          if (response.status == 201 || response.status == 200) {
            Swal.fire(
              "Verify Email",
              `Please check your inbox for verification email(it could be in spam folder)`,
              "success"
            );
            Router.push("/login");
          } else {
            Swal.fire("Whoops..", "Something Went Wrong", "error");
          }
        })
        .catch((err) => {
          Swal.fire("Whoops..", "Something Went Wrong", "error");
          console.log(err);
        });
    },
  });
  return (
    <MDBContainer
      style={{ maxWidth: "100%", backgroundColor: "rgba(156, 180, 247, 0.4)" }}
    >
      <MDBRow>
        <div className="col-12 col-md-6 col-xl-4 mx-auto">
          <div className={styles.hpLoginBody}>
            <form onSubmit={formik.handleSubmit}>
              {/* <p  className={`${styles.hpLoginHead} text-uppercase text-center`}>Register With</p>
                            <CashId
                                domain="sponsor-cash.herokuapp.com"
                                path="/api/users/cashid/parse"
                                callback={signUpCashId}
                            />
                            <p className={styles.hpSeparator}>or</p> */}
              <h2
                className={`${styles.hpLoginHead} text-uppercase text-center`}
              >
                sign up
              </h2>
              <div className="form-group">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  id="username"
                  type="username"
                  name="username"
                  className={`${styles.hpLoginFormControl} form-control`}
                  placeholder="username"
                />
                {formik.touched.username && formik.errors.username ? (
                  <MDBAlert color="danger">{formik.errors.username}</MDBAlert>
                ) : null}
              </div>
              <div className="form-group mb-0">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  type="name"
                  name="name"
                  id="name"
                  className={`${styles.hpLoginFormControl} form-control`}
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  type="email"
                  name="email"
                  id="email"
                  className={`${styles.hpLoginFormControl} form-control`}
                  placeholder="Email"
                />
                {formik.touched.email && formik.errors.email ? (
                  <MDBAlert color="danger">{formik.errors.email}</MDBAlert>
                ) : null}
              </div>
              <div className="form-group mb-0">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  type="password"
                  name="password"
                  id="password"
                  className={`${styles.hpLoginFormControl} form-control`}
                  placeholder="Password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <MDBAlert color="danger">{formik.errors.password}</MDBAlert>
                ) : null}
              </div>
              {/* <select className={`${styles.hpLoginFormControl} browser-default custom-select`}
                                    type="select" id="select" name="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.select}
                            >
                                <option disabled selected hidden>Sponsor Or Regular</option>
                                <option value="Regular">Regular</option>
                                <option value="Sponsor">Sponsor</option>
                            </select> */}
              {formik.touched.select && formik.errors.select ? (
                <MDBAlert color="danger">{formik.errors.select}</MDBAlert>
              ) : null}

              <button type="submit" className={`${styles.hpBtnCashId} btn`}>
                REGISTER
              </button>
            </form>
            <div className={styles.hpFormFooter}>
              <p className="mb-0">
                Have an Account?
                <Link href="/login">
                  <a>
                    <ins style={{ color: "#7d73c3" }}> Log in</ins>
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
export default signinForm;
