import React, {useEffect, useState} from "react";
import Layout from "../components/Layout";
import DotLoader from "react-spinners/DotLoader";
import {withRedux} from "../lib/redux";
import Card from "../components/Card/Card";
import axios from "axios";
import getConfig from "next/config";
import HeroContainer from "../components/BackgroundContainer/heroContainer";

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
    <div >
      <Layout >
        <HeroContainer/>
            <div className="container max-w-screen-xl px-4 md:px-.5 lg:px-.5 xl:px.5 mb-8 ">
                <h2 className="block md:text-3xl text-2xl text-branding-color p-2 mt-8 mb-4">
                    Completed Campaigns
                </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-20 md:gap-y-8 gap-x-16 gap-y-2 relative">
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
                              <div
                                  key={project._id}
                                  className="mb-2"
                              >
                                  <div className="transform scale-100 hover:scale-105">
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
                              </div>
                          );
                  })
              ) : (
                  <div className="p-5 object-center">
                      <DotLoader size={50} color={"#7d73c3"} />
                  </div>
              )}
          </div>
            </div>
        {/*<MDBContainer>*/}
          {/*<MDBRow>*/}
            {/*<MDBCol size="12">*/}
              {/*<div className="d-flex justify-content-between align-items-baseline hp-wrapper">*/}
                {/*{popularProjects[0] ? (*/}
                  {/*<h2 className="d-inline-block hp-headText">*/}
                    {/*Popular Campaigns*/}
                  {/*</h2>*/}
                {/*) : (*/}
                  {/*<></>*/}
                {/*)}*/}
                {/*<div>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*</MDBCol>*/}
          {/*</MDBRow>*/}
          {/*<MDBRow>*/}
            {/*{popularProjects[0] ? (*/}
              {/*popularProjects.map((project) => {*/}
                {/*let cardImage = project.images[0]*/}
                  {/*? publicRuntimeConfig.APP_URL +*/}
                    {/*"/media/project/" +*/}
                    {/*project.images[0]*/}
                  {/*: publicRuntimeConfig.APP_URL + "/media/project/default.jpg";*/}
                {/*let linkSlug = `/project/${project._id}`;*/}

                {/*return (*/}
                  {/*<MDBCol*/}
                    {/*key={project._id}*/}
                    {/*className="col-12 col-md-6 col-lg-4 mb-4"*/}
                  {/*>*/}
                    {/*<div className="hpTransformOnHover">*/}
                      {/*<Card*/}
                          {/*key={project._id}*/}
                        {/*tag={project.category}*/}
                        {/*description={project.description}*/}
                        {/*title={project.title}*/}
                        {/*funded={project.funded}*/}
                        {/*goal={project.goal}*/}
                        {/*imageSrc={cardImage}*/}
                        {/*linkSlug={linkSlug}*/}
                        {/*approved={project.approved}*/}
                      {/*/>*/}
                    {/*</div>*/}
                  {/*</MDBCol>*/}
                {/*);*/}
              {/*})*/}
            {/*) : (*/}
              {/*<></>*/}
            {/*)}*/}
          {/*</MDBRow>*/}
          {/*<MDBRow>*/}
            {/*<MDBCol size="12">*/}
              {/*<div className="d-flex justify-content-between align-items-baseline hp-wrapper">*/}
                {/*<h2 className="d-inline-block hp-headText">*/}
                  {/*Completed Campaigns*/}
                {/*</h2>*/}
                {/*<div>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*</MDBCol>*/}
          {/*</MDBRow>*/}
          {/*<MDBRow>*/}
            {/*{completedProjects[0] ? (*/}
              {/*completedProjects.map((project) => {*/}
                {/*let cardImage = project.images[0]*/}
                  {/*? publicRuntimeConfig.APP_URL +*/}
                    {/*"/media/project/" +*/}
                    {/*project.images[0]*/}
                  {/*: publicRuntimeConfig.APP_URL + "/media/project/default.jpg";*/}
                {/*let linkSlug = `/project/${project._id}`;*/}

                {/*if (project.funded >= 0.01)*/}
                  {/*return (*/}
                    {/*<MDBCol*/}
                      {/*key={project._id}*/}
                      {/*className="col-12 col-md-6 col-lg-4 mb-4"*/}
                    {/*>*/}
                      {/*<div className="hpTransformOnHover">*/}
                        {/*<Card*/}
                          {/*key={project._id}*/}
                          {/*tag={project.category}*/}
                          {/*description={project.description}*/}
                          {/*title={project.title}*/}
                          {/*funded={project.funded}*/}
                          {/*goal={project.goal}*/}
                          {/*imageSrc={cardImage}*/}
                          {/*linkSlug={linkSlug}*/}
                        {/*/>*/}
                      {/*</div>*/}
                    {/*</MDBCol>*/}
                  {/*);*/}
              {/*})*/}
            {/*) : (*/}
              {/*<MDBCol style={{ padding: "20px", align: "center" }}>*/}
                {/*<DotLoader size={50} color={"#7d73c3"} />*/}
              {/*</MDBCol>*/}
            {/*)}*/}
          {/*</MDBRow>*/}
        {/*</MDBContainer>*/}
      </Layout>
    </div>
  );
};

export default withRedux(Home);
