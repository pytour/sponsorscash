import React, { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import DotLoader from "react-spinners/DotLoader";
import { withRedux } from "../lib/redux";
import Carousel from "../components/Carousel/Carousel";
import Card from "../components/Card/Card";
import Showmore from "../components/UI/Showmore";
import axios from "axios";
import Router from "next/router";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Home = () => {
  const [popularProjects, setPopularProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  useEffect(() => {
    axios
      .get(publicRuntimeConfig.APP_URL + "/project/getPopularProjects")
      .then((res) => {
        const resProj = res.data.projects;
        setPopularProjects(resProj);
      })
      .catch((err) => console.log(err));

    axios
      .get(publicRuntimeConfig.APP_URL + "/project/getCompletedProjects")
      .then((res) => {
        // console.log(res.data.projects);
        setCompletedProjects(
          res.data.projects.sort((a, b) => b.funded - a.funded)
        );
      })
      .catch((err) => console.log(err));
  }, []);


  return (
    <div>
      <Layout>
        <Carousel />
        <MDBContainer>
          <MDBRow>
            <MDBCol size="12">
              <div className="d-flex justify-content-between align-items-baseline hp-wrapper">
                {popularProjects[0] ? (
                  <h2 className="d-inline-block hp-headText">
                    Popular Campaigns
                  </h2>
                ) : (
                  <></>
                )}
                <div>
                  {/* <MDBDropdown dropup>
                    <MDBDropdownToggle
                      className="hptoggle"
                      caret
                      color="secondary"
                    >
                      ALL
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem>Architecture</MDBDropdownItem>
                      <MDBDropdownItem>Art</MDBDropdownItem>
                      <MDBDropdownItem>Science</MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown> */}
                </div>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            {popularProjects[0] ? (
              popularProjects.map((project) => {
                let cardImage = project.images[0]
                  ? publicRuntimeConfig.APP_URL +
                    "/media/project/" +
                    project.images[0]
                  : publicRuntimeConfig.APP_URL + "/media/project/default.jpg";
                let linkSlug = `/project/${project._id}`;

                return (
                  <MDBCol
                    key={project._id}
                    className="col-12 col-md-6 col-lg-4 mb-4"
                  >
                    <div className="hpTransformOnHover">
                      <Card
                        //imageSrc="static/images/campaigns/abstract-aluminum-architectural-architecture-210158.jpg"
                        key={project._id}
                        tag={project.category}
                        description={project.description}
                        title={project.title}
                        funded={project.funded}
                        goal={project.goal}
                        imageSrc={cardImage}
                        linkSlug={linkSlug}
                        approved={project.approved}
                      />
                    </div>
                  </MDBCol>
                );
              })
            ) : (
              <></>
            )}
          </MDBRow>

          {/* <Showmore /> */}
          <MDBRow>
            <MDBCol size="12">
              <div className="d-flex justify-content-between align-items-baseline hp-wrapper">
                <h2 className="d-inline-block hp-headText">
                  Completed Campaigns
                </h2>
                <div>
                  {/* <MDBDropdown dropup>
                    <MDBDropdownToggle
                      className="hptoggle"
                      caret
                      color="secondary"
                    >
                      ALL
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem>Architecture</MDBDropdownItem>
                      <MDBDropdownItem>Art</MDBDropdownItem>
                      <MDBDropdownItem>Science</MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown> */}
                </div>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            {completedProjects[0] ? (
              completedProjects.map((project) => {
                let cardImage = project.images[0]
                  ? publicRuntimeConfig.APP_URL +
                    "/media/project/" +
                    project.images[0]
                  : publicRuntimeConfig.APP_URL + "/media/project/default.jpg";
                let linkSlug = `/project/${project._id}`;

                if (project.funded >= 0.01)
                  return (
                    <MDBCol
                      key={project._id}
                      className="col-12 col-md-6 col-lg-4 mb-4"
                    >
                      <div className="hpTransformOnHover">
                        <Card
                          key={project._id}
                          tag={project.category}
                          description={project.description}
                          title={project.title}
                          funded={project.funded}
                          goal={project.goal}
                          imageSrc={cardImage}
                          linkSlug={linkSlug}
                        />
                      </div>
                    </MDBCol>
                  );
              })
            ) : (
              <MDBCol style={{ padding: "20px", align: "center" }}>
                <DotLoader size={50} color={"#7d73c3"} />
              </MDBCol>
            )}
          </MDBRow>
        </MDBContainer>
      </Layout>
      <style jsx>{`
        .hp-wrapper {
          padding: 1em;
        }
        .hp-headText {
          color: #737dc3;
          font-weight: 400;
          font-size: 1.8rem;
        }
        .hptoggle {
          border: 1px solid #7d73c3;
          border-radius: 30px;
          color: #7d73c3;
          font-size: 1.3rem;
          width: 12rem;
        }
        .hpTransformOnHover:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default withRedux(Home);
