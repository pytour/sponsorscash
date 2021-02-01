import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import styles from "./footer.module.css";
import Link from "next/link";
const Footer = () => {
  return (
    <MDBFooter
      style={{ backgroundColor: "#7d73c3" }}
      className={` font-small  pt-0`}
    >
      <MDBContainer>
        <MDBRow style={{ justifyContent: "center" }}>
          <MDBCol md="8" className="py-5">
            <div className={styles.hpWrapper}>
              <MDBRow>
                <Link href="/">
                  <a>
                    <img
                      src="/images/logo.png"
                      alt="logo"
                      className={styles.hpLogo}
                    />
                    <p className={styles.hpBrandName}>
                      FUNDME<span style={{ color: "white" }}>.CASH</span>
                    </p>
                  </a>
                </Link>
              </MDBRow>
              <MDBRow style={{ justifyContent: "center", marginTop: "1.2rem" }}>
                <p style={{ fontSize: "1rem" }}>
                  Thanks to everyone who support our{" "}
                  <a href="https://flipstarter.fundme.cash/">
                    flipstarter campaign.
                  </a>
                </p>
              </MDBRow>
              <MDBRow style={{ justifyContent: "center", marginTop: "1.2rem" }}>
                <p style={{ fontSize: "1rem" }}>
                  For non-custodial fundraising use:{" "}
                </p>
              </MDBRow>
              <MDBRow style={{ justifyContent: "center" }}>
                <MDBCol size="7"></MDBCol>

                <MDBCol style={{ justifyContent: "center" }} size="6">
                  <MDBRow style={{ justifyContent: "center" }}>
                    <a href="https://flipstarter.cash">
                      <img
                        src="https://flipstarter.cash/static/img/logo-alt.svg"
                        alt="flipstarter"
                        className={styles.flipLogo}
                      />
                    </a>
                  </MDBRow>
                  <MDBRow style={{ justifyContent: "center" }}>
                    <a href="https://flipstarter.cash">
                      <p className={{ fontSize: "2.5rem" }}>
                        FLIPSTARTER<span style={{ color: "white" }}>.CASH</span>
                      </p>
                    </a>
                  </MDBRow>
                </MDBCol>
              </MDBRow>

              <ul>
                <li
                  style={{ listStyleType: "none" }}
                  className="d-sm-inline-block mr-sm-3 ml-sm-3"
                >
                  <button
                    type="button"
                    className={`${styles.hpBtnContact} text-uppercase`}
                  >
                    <a href="https://fundme.cash/api/media/files/whitepaper.pdf">
                      whitepaper
                    </a>
                  </button>
                </li>
                <li
                  style={{ listStyleType: "none" }}
                  className="d-sm-inline-block mr-sm-3 ml-sm-3"
                >
                  <button
                    type="button"
                    className={`${styles.hpBtnContact} text-uppercase`}
                  >
                    <a href="/faq">FAQ</a>
                  </button>
                </li>
                <li
                  style={{ listStyleType: "none" }}
                  className="d-sm-inline-block mr-sm-3 ml-sm-3"
                >
                  <button
                    type="button"
                    className={`${styles.hpBtnContact} text-uppercase`}
                  >
                    <a href="https://t.me/fundmecash">contact us</a>
                  </button>
                </li>
              </ul>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </MDBFooter>
  );
};

export default Footer;
