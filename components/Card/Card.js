import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBProgress,
} from "mdbreact";
import styles from "./card.module.css";
import Router from "next/router";

const Card = (props) => {
  const [liked, setLike] = useState(false);
  const toggleLike = () => {
    if (liked) {
      return setLike(false);
    }
    setLike(true);
  };
  const handleProjectDetailsRoute = () => {
    Router.push(`/project/[id]`, props.linkSlug, {
      shallow: true,
    });
  };

  const progress = Math.round((props.funded * 100) / props.goal);
  return (
    <MDBCol>
      <MDBCard className={styles.hpCardTopBorder}>
        <MDBCardImage
          className={`${styles.hpImageBorder} img-fluid`}
          src={props.imageSrc}
        />
        <div
          className={`${styles.hpCardHead} d-flex flex-column justify-content-between`}
        >
          <div className="d-flex justify-content-between">
            <div onClick={toggleLike}>
              <p className={styles.hpLike}>
                <i
                  style={{
                    color: liked ? "orange" : "white",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                  className="fa fa-heart"
                ></i>
              </p>
            </div>
            <>
              {/* <div className={styles.hpCountdown}>
              <div className={styles.hpCountdownNumber}></div>
              <svg className={styles.hpSvg}>
                <circle
                  style={{
                    animation: "countdown 60s linear infinite forwards",
                  }}
                  className={styles.hpCircle}
                  r="20"
                  cx="25"
                  cy="25"
                ></circle>
              </svg>
            </div> */}
            </>
          </div>
          <p className={`${styles.hpProjectCategory} d-inline-block`}>
            {props.tag}
          </p>
        </div>
        <MDBCardBody
          style={{ cursor: "pointer" }}
          onClick={handleProjectDetailsRoute}
        >
          <MDBCardTitle style={{ fontSize: '1.4rem' }}>
            {props.title && props.title.length > 20
              ? props.title.substr(0, 21) + "..."
              : props.title}
          </MDBCardTitle>
          <MDBCardText>{props.description && props.description.length > 65
              ? props.description.substr(0, 65) + "..."
              : props.description}</MDBCardText>
          <div
            style={{ backgroundColor: "#fff", padding: "0px" }}
            className="card-footer"
          >
            <p className={styles.hpProgressValue}>{progress + " %"}</p>
            <MDBProgress
              value={progress}
              className={`${styles.hpProgressBar} my-2`}
              color="info"
            />
            <div className="donations text-center">
              <div
                className={`${styles.hpFunded} d-inline-block border-right text-center`}
              >
                <p style={{ fontSize: "1rem" }} className="mb-0">
                  {props.funded + " BCH"}
                </p>
                <p className="text-uppercase mb-0">funded</p>
              </div>
              <div className={`${styles.hpGoal} d-inline-block text-center`}>
                <p style={{ fontSize: "1.2rem" }} className="mb-0">
                  {props.goal + " BCH"}
                </p>
                <p className="text-uppercase mb-0">goal</p>
              </div>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Card;
