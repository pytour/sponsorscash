import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody } from "mdbreact";
import styles from "./projectDetailPanel.module.css";
import getConfig from "next/config";
import Link from "next/link";
import DotLoader from "react-spinners/DotLoader";

const { publicRuntimeConfig } = getConfig();
const projectDetailPanel = (props) => {
  //if (props.projectCreator) console.log(props.projectCreator);
  let avatarImg = props.projectCreator.avatar
    ? `background: url(${publicRuntimeConfig.APP_URL}/media/user/${props.projectCreator.avatar})`
    : `background: url(${publicRuntimeConfig.APP_URL}/media/user/user-avatar.png)`;
  return (
      <>
          <div>
              <div className="grid">
                  {!props.details && <DotLoader size={50} color={"#7d73c3"} />}
                  <div >
                      <div className="flex flex-col lg:flex-row justify-between lg:items-center mt-2 mb-3">
                          <p
                              className="text-xl lg:text-2xl text-funded uppercase font-bold lg:mb-0 py-3 lg:mr-5 "
                          >
                              {props.details.title}
                          </p>

                          <Link href={"/" + props.projectCreator.username}>
                              <a className="text-decoration-none pt-1 pb-3" >
                                  <div
                                      className="flex justify-between items-center pl-4 border-branding-color border-1 rounded-full w-full max-w-12rem "
                                  >
                                      <p className=" text-branding-color mb-0 pr-10">
                                          {props.projectCreator.creator}
                                      </p>
                                      <div className="block relative w-12 h-12 overflow-hidden rounded-half">
                                          <img
                                              src={
                                                  props.projectCreator.avatar
                                                      ? `${publicRuntimeConfig.APP_URL}/media/user/${props.projectCreator.avatar}`
                                                      : `${publicRuntimeConfig.APP_URL}/media/user/user-avatar.png`
                                              }
                                              alt="avatar"
                                              className="w-full h-full"
                                          />
                                      </div>
                                  </div>
                              </a>
                          </Link>
                      </div>

                      <p className="text-custom whitespace-pre-wrap">{props.details.details}</p>
                      {props.details.approved && (
                      <div  className="shadow-lg rounded-full text-gray mt-10 mb-10"                          >
                          <div>
                              <div className="p-3">
                                  <p></p>
                                  <i class="fas fa-user-check m-2" size="12">
                                      {" "}
                                      Campaign approved by FUNDME.CASH team
                                  </i>
                              </div>
                          </div>
                      </div>
                      )}
                  </div>
              </div>
          </div>


          {/*<MDBContainer>*/}
      {/*<MDBRow>*/}
        {/*{!props.details && <DotLoader size={50} color={"#7d73c3"} />}*/}
        {/*<MDBCol size="12">*/}
          {/*<div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mt-3 mt-lg-0 mb-3">*/}
            {/*<p*/}
              {/*className={`${styles.projectTitle} text-uppercase font-weight-bold mb-lg-0 mr-lg-5`}*/}
            {/*>*/}
              {/*{props.details.title}*/}
            {/*</p>*/}

            {/*<Link href={"/" + props.projectCreator.username}>*/}
              {/*<a className="text-decoration-none">*/}
                {/*<div*/}
                  {/*className={`${styles.userChip} d-flex justify-content-between align-items-center pl-3`}*/}
                {/*>*/}
                  {/*<p className={`${styles.userName} mb-0 pr-3`}>*/}
                    {/*{props.projectCreator.creator}*/}
                  {/*</p>*/}
                  {/*<div className={styles.avatar}>*/}
                    {/*<img*/}
                      {/*src={*/}
                        {/*props.projectCreator.avatar*/}
                          {/*? `${publicRuntimeConfig.APP_URL}/media/user/${props.projectCreator.avatar}`*/}
                          {/*: `${publicRuntimeConfig.APP_URL}/media/user/user-avatar.png`*/}
                      {/*}*/}
                      {/*alt="avatar"*/}
                      {/*className={styles.avatarImg}*/}
                    {/*/>*/}
                  {/*</div>*/}
                {/*</div>*/}
              {/*</a>*/}
            {/*</Link>*/}
          {/*</div>*/}

          {/*<p className={styles.cardText}>{props.details.details}</p>*/}
          {/*{props.details.approved && (*/}
            {/*<MDBCard*/}
              {/*style={{*/}
                {/*borderRadius: "24px",*/}
                {/*color: "gray",*/}
                {/*marginTop: "40px",*/}
                {/*marginBottom: "40px",*/}
              {/*}}*/}
            {/*>*/}
              {/*<MDBCardBody>*/}
                {/*<MDBRow>*/}
                  {/*<p></p>*/}
                  {/*<i class="fas fa-user-check m-2" size="12">*/}
                    {/*{" "}*/}
                    {/*Campaign approved by FUNDME.CASH team*/}
                  {/*</i>*/}
                {/*</MDBRow>*/}
              {/*</MDBCardBody>*/}
            {/*</MDBCard>*/}
          {/*)}*/}
        {/*</MDBCol>*/}
      {/*</MDBRow>*/}
    {/*</MDBContainer>*/}

        </>
  );
};

export default projectDetailPanel;
