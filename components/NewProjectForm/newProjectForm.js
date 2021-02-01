import React, { useEffect, useState } from "react";

import { MDBAlert, MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import styles from "./newProjectForm.module.css";
import { useFormik } from "formik";
import axios from "axios";
import * as Swal from "sweetalert2";
import Router from "next/router";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = "Required";
  } else if (!(values.title.length >= 4 && values.title.length < 150)) {
    errors.title = "Must be greater then 4 characters and less then 150 ";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (
    !(values.description.length >= 4 && values.description.length < 300)
  ) {
    errors.description = "Must be greater then 4 characters and less then 300 ";
  }

  if (!values.detail) {
    errors.detail = "Required";
  } else if (!(values.detail.length >= 4 && values.detail.length < 5000)) {
    errors.detail = "Must be greater then 4 characters and less then 5000 ";
  }

  if (!values.select) {
    errors.select = "Required";
  }

  if (!values.goal) {
    errors.goal = "Required";
  } else {
    let goal = +values.goal;
    if (typeof goal !== "number" && !isNaN(goal)) {
      errors.goal = "Must be number";
    } else if (goal < 0.001) {
      errors.goal = "Must be greater than 0.001 BCH";
    }
  }

  return errors;
};

const newProjectForm = () => {
  const dispatch = useDispatch();
  const [projectImages, setProjectImages] = useState({});
  const [isImageSet, setIsImageSet] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (!token) {
      Swal.fire("Please Login first", "error", "error");
      Router.push("/login");
    } else {
      //
      // TODO: [BAC-1] check token expiration in new project page 
      // Need to check neither session token expire or not
      // if expire run DEAUTHENTICATE ask to login again
      // Route to login_page
      axios
        .get(publicRuntimeConfig.APP_URL + "/users/getUserProfile", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          console.log('auth ok');
        })
        .catch((err) => {
          console.log(err)
          Swal.fire("Please Login first", "error", "error");
          dispatch({ type: "DEAUTHENTICATE" });
          Router.push("/login");
        });
    }

    
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      select: "",
      detail: "",
      goal: "",
    },
    validate,
    onSubmit: (values) => {
      axios
        .post(
          publicRuntimeConfig.APP_URL + "/project/createProject",
          {
            values: values,
            images: projectImages,
            date: date,
          },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((response) => {
          if (response.data.status === 200) {
            Swal.fire(response.data.message, "success", "success");
            Router.push("/privateAccount", "/" + response.data.username);
          }
        })
        .catch((err) => {
          Swal.fire("Whoops..", "Something Went Wrong:" + err, "error");
          console.log("ERROR WHILE TRYING CREATE CAMPAIGN:",err);
        });
    },
  });

  //Convert Blob to Data URI
  const imageSelect = async (e) => {
    let image = "";
    let name = e.target.name;
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = await function () {
      image = reader.result;
      setImages(name, image);
    };
  };
  //Set the DataURI in state.
  const setImages = (name, image) => {
    setProjectImages({
      ...projectImages,
      [name]: image,
    });
    setIsImageSet(!isImageSet);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  return (
    <MDBContainer className="my-4">
      <MDBRow>
        <MDBCol lg="5">
          <h6>Choose Project Images (Optional)</h6>
          <div className={styles.projectMainImg}>
            <input
              onChange={imageSelect}
              type="file"
              id="image1"
              name="image1"
              accept="image/*"
              style={{ display: "none" }}
            />
            <label htmlFor="image1" className={styles.hpAvatarPicker}>
              <p className={styles.hpAvatarPickerLabel}>Choose Image</p>
            </label>
            {projectImages.image1 ? (
              <img src={projectImages.image1} className="w-100" />
            ) : (
              ""
            )}
          </div>
          <div className="d-flex justify-content-between">
            <div className={styles.projectMinorImg}>
              {projectImages.image2 ? (
                <img src={projectImages.image2} className="w-100 h-100" />
              ) : (
                ""
              )}
              <input
                onChange={imageSelect}
                type="file"
                id="image2"
                name="image2"
                accept="image/*"
                style={{ display: "none" }}
              />
              <label htmlFor="image2" className={styles.hpAvatarPicker}>
                <p className={styles.hpAvatarPickerLabel}>Change Image</p>
              </label>
            </div>
            <div className={styles.projectMinorImg}>
              {projectImages.image3 ? (
                <img src={projectImages.image3} className="w-100 h-100" />
              ) : (
                ""
              )}
              <input
                onChange={imageSelect}
                type="file"
                id="image3"
                name="image3"
                accept="image/*"
                style={{ display: "none" }}
              />
              <label htmlFor="image3" className={styles.hpAvatarPicker}>
                <p className={styles.hpAvatarPickerLabel}>Change Image</p>
              </label>
            </div>
            <div className={styles.projectMinorImg}>
              {projectImages.image4 ? (
                <img src={projectImages.image4} className="w-100 h-100" />
              ) : (
                ""
              )}
              <input
                onChange={imageSelect}
                type="file"
                id="image4"
                name="image4"
                accept="image/*"
                style={{ display: "none" }}
              />
              <label htmlFor="image4" className={styles.hpAvatarPicker}>
                <p className={styles.hpAvatarPickerLabel}>Change Image</p>
              </label>
            </div>
            <div className={styles.projectMinorImg}>
              {projectImages.image5 ? (
                <img src={projectImages.image5} className="w-100 h-100" />
              ) : (
                ""
              )}
              <input
                onChange={imageSelect}
                type="file"
                id="image5"
                name="image5"
                accept="image/*"
                style={{ display: "none" }}
              />
              <label htmlFor="image5" className={styles.hpAvatarPicker}>
                <p className={styles.hpAvatarPickerLabel}>Change Image</p>
              </label>
            </div>
          </div>
        </MDBCol>
        <MDBCol lg="7">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className={styles.hpDatePicker}>
                <div className="form-group">
                  <p>Campaign Title:</p>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Campaign title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    className={styles.hpInputStyle}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <MDBAlert color="danger">{formik.errors.title}</MDBAlert>
                  ) : null}
                </div>
              </div>
              <div className={styles.hpDatePicker}>
                <div className="form-group">
                  <p>Funding goal:</p>
                  <input
                    type="text"
                    name="goal"
                    id="goal"
                    placeholder="Funding Goal (BCH)"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.goal}
                    className={styles.hpInputStyle}
                  />
                  {formik.touched.goal && formik.errors.goal ? (
                    <MDBAlert color="danger">{formik.errors.goal}</MDBAlert>
                  ) : null}
                </div>
              </div>
              <select
                className={`${styles.hpInputStyle} browser-default custom-select`}
                type="select"
                id="select"
                name="select"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.select}
              >
                <option selected hidden>
                  Category
                </option>
                <option value="Art">Art</option>
                <option value="Architecture">Architecture</option>
                <option value="Audio">Audio</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Blogs and Vlogs">Blogs and Vlogs</option>
                <option value="Culture">Culture</option>
                <option value="Dance and Theater">Dance and Theater</option>
                <option value="Education">Education</option>
                <option value="Enviroment">Enviroment</option>
                <option value="Fashion and Wearables">
                  Fashion & Wearables
                </option>
                <option value="Film">Film</option>
                <option value="Food and Beverages">Food & Beverages</option>
                <option value="Health and Fitness">Health and Fitness</option>
                <option value="Home">Home</option>
                <option value="Human Rights">Human Rights</option>
                <option value="Local Businesses">Local Businessess</option>
                <option value="Mobile">Mobile</option>
                <option value="Music">Music</option>
                <option value="Other">Other</option>
                <option value="Podcasts">Podcasts</option>
                <option value="Photography">Photography</option>
                <option value="Sport">Sport</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Transportation">Transportation</option>
                <option value="Travel and Outdoors">Travel & Outdoors</option>
                <option value="Video games">Video Games</option>
                <option value="Video">Video</option>
                <option value="Wellness">Wellness</option>
                <option value="Web series and TV shows">
                  Web Series & TV shows
                </option>
                <option value="Writing and Publishing">
                  Writing and Publishing
                </option>
              </select>
              {formik.touched.select && formik.errors.select ? (
                <MDBAlert color="danger">{formik.errors.select}</MDBAlert>
              ) : null}
              <div className={styles.hpDatePicker}>
                <p>Funding End Date:</p>
                <DatePicker selected={date} onChange={handleDateChange} />
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  id="description"
                  placeholder="Campaign short description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  className={styles.hpTextAreaStyle}
                />
                {formik.touched.description && formik.errors.description ? (
                  <MDBAlert color="danger">
                    {formik.errors.description}
                  </MDBAlert>
                ) : null}
              </div>
              <div className="form-group">
                <textarea
                  name="detail"
                  id="detail"
                  rows="6"
                  placeholder="Campaign full description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.detail}
                  className={styles.hpTextAreaStyleDetail}
                />
                {formik.touched.detail && formik.errors.detail ? (
                  <MDBAlert color="danger">{formik.errors.detail}</MDBAlert>
                ) : null}
              </div>
            </div>
            <MDBBtn type="submit" className={styles.hpCreateProjectBtn}>
              Create Project
            </MDBBtn>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default newProjectForm;
