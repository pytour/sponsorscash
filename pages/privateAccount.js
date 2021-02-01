import React, { useState, useEffect } from "react";
import { withRedux } from "../lib/redux";
import Layout from "../components/Layout/Layout";
import ProfileCard from "../components/PA-ProfileCard/profileCard";
import WideCard from "../components/PA-WideCard/wideCard";
import Showmore from "../components/UI/Showmore";
import MyDonations from "../components/MyDonations/myDonations";

import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBRow,
} from "mdbreact";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const privateAccount = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => {
    console.log("state", state);
    return state.projects;
  });

  const [userData, setUserData] = useState({});
  // const [projects, setProjects] = useState([]);
  const token = useSelector((state) => state.token);
  useEffect(() => {
    if (!token) {
      Swal.fire("Please Login first", "error", "error");
      Router.push("/login");
    } else {
      axios
        .get(publicRuntimeConfig.APP_URL + "/users/getUserProfile", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          console.log(res.data);
          setUserData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    axios
      .get(publicRuntimeConfig.APP_URL + "/project/getProjects", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status === 200) {
          const resProjects = res.data.projects;
          dispatch({ type: "UPDATE_PROJECTS", payload: resProjects });
          // setProjects(projects);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const renderProjects = () => {
    return projects.map((project, index) => {
      if (project.status !== "CANCELED")
        return (
          <div key={index}>
            <WideCard
              dispatch={dispatch}
              imgSrc={project.images[0]}
              title={project.title}
              category={project.category}
              goal={project.goal}
              fundingEnds={project.endTime}
              funded={project.funded}
              projectID={project._id}
            />
          </div>
        );
    });
  };
  return (
    <Layout isPrivatePage={true}>
      <ProfileCard userData={userData} showEditButton={true} />
      <MDBContainer>
        <MDBRow>
          <MDBCol size="12">
            <div className="d-flex justify-content-between align-items-baseline hp-wrapper">
              <h2 className="d-inline-blo-ck hp-headText">My Projects</h2>
              <a
                className="newProjectButton"
                type="button"
                onClick={() => {
                  Router.push("/newProject");
                }}
              >
                New Campaign
              </a>
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size="12">
            {projects ? renderProjects() : <p>Loading projects...</p>}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <MyDonations userData={userData} />
      {/* <Showmore /> */}
      <style jsx>{`
        .hp-wrapper {
          padding: 1rem;
        }
        .hp-headText {
          color: #737dc3;
          font-weight: 400;
          font-size: 2.3rem;
        }

        .hptoggle {
          border: 1px solid #7d73c3;
          border-radius: 30px;
          color: #7d73c3;
          font-size: 1.3rem;
          width: 12rem;
        }

        .newProjectButton {
          color: rgb(125, 115, 195) !important;
          font-size: 1em;
          font-weight: 400;
          border: 1px solid #ffca79;
          border-radius: 20px;
          padding: 5px 20px 5px 20px;
        }

        .newProjectButton:hover {
          transform: scale(1.02);
          color: rgb(85, 77, 134) !important;
        }
      `}</style>
    </Layout>
  );
};

export default withRedux(privateAccount);
