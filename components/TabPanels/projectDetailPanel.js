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
    <MDBContainer>
      <MDBRow>
        {!props.details && <DotLoader size={50} color={"#7d73c3"} />}
        <MDBCol size="12">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mt-3 mt-lg-0 mb-3">
            <p
              className={`${styles.projectTitle} text-uppercase font-weight-bold mb-lg-0 mr-lg-5`}
            >
              {props.details.title}
            </p>

            <Link href={"/" + props.projectCreator.username}>
              <a className="text-decoration-none">
                <div
                  className={`${styles.userChip} d-flex justify-content-between align-items-center pl-3`}
                >
                  <p className={`${styles.userName} mb-0 pr-3`}>
                    {props.projectCreator.creator}
                  </p>
                  <div className={styles.avatar}>
                    <img
                      src={
                        props.projectCreator.avatar
                          ? `${publicRuntimeConfig.APP_URL}/media/user/${props.projectCreator.avatar}`
                          : `${publicRuntimeConfig.APP_URL}/media/user/user-avatar.png`
                      }
                      alt="avatar"
                      className={styles.avatarImg}
                    />
                  </div>
                </div>
              </a>
            </Link>
          </div>

          <p className={styles.cardText}>{props.details.details}</p>
          {props.details.approved && (
            <MDBCard
              style={{
                borderRadius: "24px",
                color: "gray",
                marginTop: "40px",
                marginBottom: "40px",
              }}
            >
              <MDBCardBody>
                <MDBRow>
                  <p></p>
                  <i class="fas fa-user-check m-2" size="12">
                    {" "}
                    Campaign approved by FUNDME.CASH team
                  </i>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default projectDetailPanel;
