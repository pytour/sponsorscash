import React, {useEffect, useState} from "react";
import {withRedux} from "../lib/redux";
import Layout from "../components/Layout/Layout";
import ProfileCard from "../components/PA-ProfileCard/profileCard";
import Card from "../components/Card/Card";
import Router, {useRouter} from "next/router";
import getConfig from "next/config";
import axios from "axios";
import {useSelector} from "react-redux";
import DotLoader from "react-spinners/DotLoader";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig();

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
            <div className="container max-w-screen-xl px-4 md:px-.5 lg:px-.5 xl:px.5 mb-8 ">
                <h2 className="block md:text-3xl text-2xl text-branding-color p-2 mt-8 mb-4">
                    Completed Campaigns
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-20 md:gap-y-8 gap-x-16 gap-y-3 relative">
                {!userProjects && <DotLoader size={50} color={"#7d73c3"} />}
                {userProjects
                    ? userProjects.map((project) => {
                        let projImage = project.images[0] ?
                            publicRuntimeConfig.APP_URL +
                            "/media/project/" +
                            project.images[0] : publicRuntimeConfig.APP_URL +
                            "/media/project/default.jpg";
                        let linkSlug = `/project/${project._id}`;

                        return (
                            <div
                                className="mb-2"
                                key={project._id}
                            >
                                <div className="transform scale-100 hover:scale-105">
                                   {/*/!*<Link href={"/project/" + project._id}>*!/*/}
                                       {/*<a  href={"/project/" + project._id} className="no-underline ">*/}
                                    <Card
                                        key={project._id}
                                        tag={project.category}
                                        description={project.description}
                                        title={project.title}
                                        funded={project.funded}
                                        goal={project.goal}
                                        imageSrc={projImage}
                                        linkSlug={linkSlug}
                                        nested={true}
                                    />
                                {/*</a>*/}
                                   {/*</Link>*/}
                                </div>
                            </div>
                        );
                    })
                    : projectsList()}
            </div>
        </div>

        {/*<ProfileCard userData={userData} showEditButton={false} />*/}
      {/*<MDBContainer>*/}
      {/*<MDBRow>*/}
            {/*<MDBCol size="12">*/}
              {/*<div className="d-flex justify-content-between align-items-baseline hp-wrapper">*/}
                {/*<h2 className="d-inline-block hp-headText">*/}
                  {/*Campaigns*/}
                {/*</h2>*/}
              {/*</div>*/}
            {/*</MDBCol>*/}
          {/*</MDBRow>*/}
        {/*<MDBRow>*/}
          {/*{!userProjects && <DotLoader size={50} color={"#7d73c3"} />}*/}
          {/*{userProjects*/}
            {/*? userProjects.map((project) => {*/}
                {/*let projImage = project.images[0] ?*/}
                  {/*publicRuntimeConfig.APP_URL +*/}
                  {/*"/media/project/" +*/}
                  {/*project.images[0] : publicRuntimeConfig.APP_URL +*/}
                  {/*"/media/project/default.jpg";*/}
                {/*return (*/}
                  {/*<MDBCol*/}
                    {/*className="col-12 col-md-6 col-lg-4 mb-4"*/}
                    {/*key={project._id}*/}
                  {/*>*/}
                    {/*<a href={"/project/" + project._id}>*/}
                      {/*<Card*/}
                        {/*tag={project.category}*/}
                        {/*description={project.description}*/}
                        {/*title={project.title}*/}
                        {/*funded={project.funded}*/}
                        {/*goal={project.goal}*/}
                        {/*imageSrc={projImage}*/}
                      {/*/>*/}
                    {/*</a>*/}
                  {/*</MDBCol>*/}
                {/*);*/}
              {/*})*/}
            {/*: projectsList()}*/}
        {/*</MDBRow>*/}
      {/*</MDBContainer>*/}
      {/* <Showmore /> */}

    </Layout>
  );
};

export default withRedux(publicAccount);
