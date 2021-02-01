import React, { useEffect, useState } from "react";
import { withRedux } from "../lib/redux";
import Layout from "../components/Layout/Layout";
import ProfileCard from "../components/PA-ProfileCard/profileCard";
import Showmore from "../components/UI/Showmore";
import Supporters from "../components/Supporters/supporters";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import Card from "../components/Card/Card";
import Router, { useRouter } from "next/router";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import axios from "axios";
import { useSelector } from "react-redux";
import DotLoader from "react-spinners/DotLoader";

const publicAccount = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [userProjects, setUserProjects] = useState(null);

  const token = useSelector((state) => state.token);
  const username = useSelector((state) => state.username);
  useEffect(() => {
    if (token && username === router.query.userpublicpage) {
      Router.push("/privateAccount", "/" + username);
    } else {
      axios
        .get(
          publicRuntimeConfig.APP_URL +
            "/users/getUserProfile/" +
            router.query.userpublicpage
        )
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(
  //       publicRuntimeConfig.APP_URL +
  //         "/users/getUserProfile/" +
  //         router.query.userpublicpage
  //     )
  //     .then((res) => {
  //       setUserData(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const projectsList = () => {
    let projArr = [];
    console.log("userdata:", userData.projects);
    if (userData.projects)
      axios
        .post(publicRuntimeConfig.APP_URL + "/project/getArrayOfProjects/", {
          projects: userData.projects,
        })
        .then((res) => {
          projArr = res.data.projects;
          console.log("projects", projArr);
          setUserProjects(projArr);
        })
        .catch((err) => console.log(err));
  };

  return (
    <Layout>
      <ProfileCard userData={userData} showEditButton={false} />
      <MDBContainer>
      <MDBRow>
            <MDBCol size="12">
              <div className="d-flex justify-content-between align-items-baseline hp-wrapper">
                <h2 className="d-inline-block hp-headText">
                  Campaigns
                </h2>
              </div>
            </MDBCol>
          </MDBRow>
        <MDBRow>
          {!userProjects && <DotLoader size={50} color={"#7d73c3"} />}
          {userProjects
            ? userProjects.map((project) => {
                let projImage = project.images[0] ?
                  publicRuntimeConfig.APP_URL +
                  "/media/project/" +
                  project.images[0] : publicRuntimeConfig.APP_URL +
                  "/media/project/default.jpg";
                return (
                  <MDBCol
                    className="col-12 col-md-6 col-lg-4 mb-4"
                    key={project._id}
                  >
                    <a href={"/project/" + project._id}>
                      <Card
                        tag={project.category}
                        description={project.description}
                        title={project.title}
                        funded={project.funded}
                        goal={project.goal}
                        imageSrc={projImage}
                      />
                    </a>
                  </MDBCol>
                );
              })
            : projectsList()}
        </MDBRow>
      </MDBContainer>
      {/* <Showmore /> */}
      <style jsx>{`
        .hp-wrapper {
          padding: 1em;
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
      `}</style>
    </Layout>
  );
};

export default withRedux(publicAccount);
