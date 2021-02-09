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
      <div className="">
          {/*<div className="w-full  h-full  bg-hero-md">*/}
              {/*<div className="container relative mx-auto relateive left-0  py-20  space-y-15  mb-16 px-0">*/}
                  {/*<h1 className="font-sans font-extrabold text-5xl leading-tight">*/}
                      {/*We Help to <b className="text-indigo-600">Build</b> <br />*/}
                      {/*Your Dream*/}
                  {/*</h1>*/}
                  {/*<p className="w-1/2">*/}
                      {/*We are always availed to consult on taking your higher education to*/}
                      {/*the next level so you can stay competitive in the global world. We*/}
                      {/*welcome the opportunity to work with you "today" for "tomorrow's"*/}
                      {/*better career solutions.*/}
                  {/*</p>*/}

                  {/*<button className="bg-indigo-500 rounded-lg py-2   px-8 text-white">*/}
                      {/*Apply Online*/}
                  {/*</button>*/}

              {/*</div>*/}
          {/*</div>*/}

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
                src="/slide/girl.png"
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
            </MDBCarouselCaption>
          </MDBCarouselItem>
          <MDBCarouselItem itemId="2">
            <MDBView>
              <img
                className="d-block w-100"
                src="/slide/man.png"
                alt="Second slide"
              />
              <MDBMask overlay="black-strong" />
            </MDBView>
            <MDBCarouselCaption className={styles.hpCarouselCaption}>
              <h3 className={styles.hpHeadingWeight}>Create your campaign</h3>

            </MDBCarouselCaption>
          </MDBCarouselItem>
        </MDBCarouselInner>
      </MDBCarousel>
    </MDBContainer>
      </div>
  );
};

export default Carousel;
