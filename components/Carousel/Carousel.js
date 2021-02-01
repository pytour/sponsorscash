import React from "react";
import Router from "next/router";

import {
  MDBCarousel,
  MDBCarouselCaption,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBView,
  MDBMask,
  MDBContainer,
} from "mdbreact";
import styles from "./carousel.module.css";
const Carousel = () => {
  return (
    <MDBContainer className={styles.hpCarouselWrapper}>
      <MDBCarousel
        activeItem={1}
        length={1}
        showControls={false}
        showIndicators={true}
        className="z-depth-1"
      >
        <MDBCarouselInner>
          <MDBCarouselItem itemId="1">
            <MDBView>
              <img
                className={`${styles.carouselImage} d-block`}
                src="static/images/slide/girl.png"
                alt="First slide"
              />
              <MDBMask overlay="black-strong" />
            </MDBView>
            <MDBCarouselCaption className={styles.hpCarouselCaption}>
              <h3 className={styles.hpHeadingWeight}>
                Fundraising with bitcoin cash
              </h3>
              <p className={styles.hpText}>
                Fundme.Cash: Fundraising for the projects and causes you care
                about.
              </p>
              <button
                type="button"
                className={`${styles.hpBtnContact} text-uppercase`}
                onClick={() => {
                  Router.push("/login");
                }}
              >
                explore
              </button>
              {/*
              <h3 className={styles.hpHeadingWeight}>
                Fundraising to build a better/profitable experience
              </h3>
              <p className={styles.hpText}>
                A better experience for users and a profitable venture for investors. 
              </p><a href="https://flipstarter.fundme.cash/">
              <button
                type="button"
                className={`${styles.hpBtnContact} text-uppercase`}
              >
                donate
              </button></a>
              */}
            </MDBCarouselCaption>
          </MDBCarouselItem>
          <MDBCarouselItem itemId="2">
            <MDBView>
              <img
                className="d-block w-100"
                src="static/images/slide/man.png"
                alt="Second slide"
              />
              <MDBMask overlay="black-strong" />
            </MDBView>
            <MDBCarouselCaption className={styles.hpCarouselCaption}>
              <h3 className={styles.hpHeadingWeight}>Create your campaign</h3>
              {/* <p className={styles.hpText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Rhoncus urna neque viverra justo. Ac auctor augue mauris augue.
              </p>
              <button
                type="button"
                className={`${styles.hpBtnContact} text-uppercase`}
              >
                explore
              </button> */}
            </MDBCarouselCaption>
          </MDBCarouselItem>
          {/* <MDBCarouselItem itemId="3">
            <MDBView>
              <img
                className="d-block w-100"
                src="static/images/slide/zebra.png"
                alt="Third slide"
              />
              <MDBMask overlay="black-strong" />
            </MDBView>
            <MDBCarouselCaption className={styles.hpCarouselCaption}>
              <h3 className={styles.hpHeadingWeight}>
                In Aliquam Sem Fringilla
              </h3>
              <p className={styles.hpText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Rhoncus urna neque viverra justo. Ac auctor augue mauris augue.
              </p>
              <button
                type="button"
                className={`${styles.hpBtnContact} text-uppercase`}
              >
                explore
              </button>
            </MDBCarouselCaption>
          </MDBCarouselItem> */}
        </MDBCarouselInner>
      </MDBCarousel>
    </MDBContainer>
  );
};

export default Carousel;
