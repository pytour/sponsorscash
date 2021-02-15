import React, { useState, useEffect } from "react";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import SmallCard from "../PA-SmallCard/smallCard";
import Router from "next/router";

import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const myDonations = (props) => {
  console.log("user data", props.userData);
  // let userData = props.userData;
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (props.userData.id)
      axios
        .post(publicRuntimeConfig.APP_URL + "/donations/getUserDonations", {
          userId: props.userData.id,
        })
        .then((res) => {
          if (res.data.status === 200) {
            // console.log("my donations: ", res.data);
            // console.log("userData: ", props.userData);
            setDonations(res.data.donations);
          }
        })
        .catch((err) => console.log(err));
  }, [props.userData.id]);

  return (
      <>

          <div className="max-w-screen-xl mx-auto  px-2  lg:px-8 xl:px-0 mb-16">
                      <div className="flex justify-between">
                          <p className="block lg:text-3xl text-branding-color py-4 text-xl">My Donations</p>
                      </div>

              <div className="lg:container  grid gird-cols md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3 gap-x-2 lg:gap-x-8 gap-y-4  ">
                  {donations[0] ? (
                      donations.map((donation, index) => {
                          const handleProjectDetailsRoute = () => {
                              Router.push(`/project/[id]`, `/project/${donation.projectId}`);
                          };
                          return (
                              <div key={index} className="w-full">
                                  {donation.projectId ? (
                                      <div
                                          className="transform hover:scale-110  cursor-pointer"
                                          onClick={handleProjectDetailsRoute}
                                      >
                                          <SmallCard
                                              key={donation._id}
                                              imgSrc={donation.projectImage}
                                              text={donation.projectTitle}
                                              value={donation.donatedBCH}
                                          />
                                      </div>
                                  ) : (
                                      <SmallCard
                                          key={donation._id}
                                          imgSrc={donation.projectImage}
                                          text={donation.projectTitle}
                                          value={donation.donatedBCH}
                                      />
                                  )}
                              </div>
                          );
                      })
                  ) : (
                      <p>No data</p>
                  )}
              </div>
          </div>

    {/*<MDBContainer>*/}
      {/*<MDBRow>*/}
        {/*<MDBCol size="12">*/}
          {/*<div className="d-flex justify-content-between align-items-baseline hp-wrapper">*/}
            {/*<h2 className="d-inline-block hp-headText">My Donations</h2>*/}
          {/*</div>*/}
        {/*</MDBCol>*/}
      {/*</MDBRow>*/}
      {/*<MDBRow>*/}
        {/*{donations[0] ? (*/}
          {/*donations.map((donation, index) => {*/}
            {/*const handleProjectDetailsRoute = () => {*/}
              {/*Router.push(`/project/[id]`, `/project/${donation.projectId}`);*/}
            {/*};*/}
            {/*return (*/}
              {/*<MDBCol key={index} className="col-12 col-md-6 col-lg-4">*/}
                {/*{donation.projectId ? (*/}
                  {/*<div*/}
                    {/*className="hpTransformOnHover"*/}
                    {/*style={{ cursor: "pointer" }}*/}
                    {/*onClick={handleProjectDetailsRoute}*/}
                  {/*>*/}
                    {/*<SmallCard*/}
                      {/*key={donation._id}*/}
                      {/*imgSrc={donation.projectImage}*/}
                      {/*text={donation.projectTitle}*/}
                      {/*value={donation.donatedBCH}*/}
                    {/*/>*/}
                  {/*</div>*/}
                {/*) : (*/}
                  {/*<SmallCard*/}
                    {/*key={donation._id}*/}
                    {/*imgSrc={donation.projectImage}*/}
                    {/*text={donation.projectTitle}*/}
                    {/*value={donation.donatedBCH}*/}
                  {/*/>*/}
                {/*)}*/}
              {/*</MDBCol>*/}
            {/*);*/}
          {/*})*/}
        {/*) : (*/}
          {/*<p>No data</p>*/}
        {/*)}*/}
      {/*</MDBRow>*/}
      {/*<style jsx>{`*/}
              {/*.hp-wrapper{*/}
              {/*padding:1rem;*/}
              {/*}*/}

              {/*.hp-headText{*/}
                {/*color:#737dc3;*/}
                {/*font-weight:400;*/}
                {/*font-size:2.3rem;*/}
              {/*}*/}

              {/*.hpTransformOnHover:hover{*/}
                {/*transform: scale(1.05);*/}
              {/*}*/}
            {/*}*/}
            {/*`}</style>*/}
    {/*</MDBContainer>*/}
          </>
  );
};

export default myDonations;
