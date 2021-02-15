import React, {useEffect, useState} from "react";
import {withRedux} from "../lib/redux";
import Layout from "../components/Layout/Layout";
import ProfileCard from "../components/PA-ProfileCard/profileCard";
import WideCard from "../components/PA-WideCard/wideCard";
import MyDonations from "../components/MyDonations/myDonations";
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
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
      <div className="my-4 max-w-screen-xl mx-auto">
          <div className="flex  container justify-between items-baseline px-4 lg:px-0">
              <p className="inline-block lg:text-3xl text-branding-color py-4 text-xl ">My Projects</p>
              <a
                  className="bg-white border-branding-text-color border-1 px-4 py-1 rounded-full pr-2 transform hover:scale-110"
                  type="button"
                  onClick={() => {
                      Router.push("/newProject");
                  }}
              >
                  New Campaign
              </a>
          </div>


          <div className="container px-4 lg:px-0 ">
            {projects ? renderProjects() : <p>Loading projects...</p>}
          </div>

      </div>
        <div className="container ">
      <MyDonations userData={userData} />
        </div>

    </Layout>
  );
};

export default withRedux(privateAccount);
