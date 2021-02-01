import React, { useEffect, useState } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  // MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBContainer,
  MDBHamburgerToggler,
  // MDBNavLink,
  // MDBDropdown,
  // MDBDropdownMenu,
  // MDBDropdownItem,
  // MDBDropdownToggle,
  // MDBIcon,
} from "mdbreact";
import Link from "next/link";
import styles from "./navbar.module.css";
import { withRedux } from "../../lib/redux";
import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import * as Swal from "sweetalert2";

const NavbarPage = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  // const token = useSelector((state) => state.token);
  const name = useSelector((state) => state.name);
  const username = useSelector((state) => state.username);

  const loginButton = () => {
    if (isLoggedIn && username) {
      // console.log("router ", router.pathname);
      if (props.isPrivatePage && "/privateAccount" === router.pathname) {
        return (
          <a
            onClick={() => {
              dispatch({ type: "DEAUTHENTICATE" });
              Router.push("/login");
            }}
            className={`${styles.hpText} ${styles.linkTransformOnHover} nav-link text-uppercase`}
          >
            Log out
          </a>
        );
      } else {
        return (
          <a
            onClick={() => {
              Router.push("/privateAccount", "/" + username);
            }}
          >
            <strong
              className={`${styles.hpText} ${styles.linkTransformOnHover} nav-link text-uppercase`}
            >
              {name || username}
            </strong>
          </a>
        );
      }
    } else {
      return (
        <Link href="/login">
          <a>
            <strong
              className={`${styles.hpText} ${styles.linkTransformOnHover} nav-link text-uppercase`}
            >
              Login
            </strong>
          </a>
        </Link>
      );
    }
  };

  const warnMessage = () => {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      html: `This site is in BETA, bugs may be present. Report bugs to
    <a href="https://t.me/fundmecash">our telegram chat</a>`,
    });
  };

  const campaignButton = () => {
    if (isLoggedIn && username) {
      return (
        <a
          onClick={() => {
            Router.push("/newProject");
          }}
          className={`${styles.hpText} ${styles.linkTransformOnHover} nav-link text-uppercase`}
        >
          Start Campaign
        </a>
      );
    } else {
      return (
        <Link href="/login">
          <a>
            <strong
              className={`${styles.hpText} ${styles.linkTransformOnHover} nav-link text-uppercase`}
            >
              Start Campaign
            </strong>
          </a>
        </Link>
      );
    }
  };

  return (
    <MDBNavbar style={{ backgroundColor: "#7d73c3" }}>
      <MDBContainer>
        <MDBNavbarBrand>
          <Link href="/">
            <a>
              <p className={styles.hpBrandName}>
                FUNDME<span style={{ color: "white" }}>.CASH </span>
                <span onClick={warnMessage} style={{ color: "red" }}>
                  BETA
                </span>
                <span
                  style={{
                    color: "red",
                    backgroundColor: "white",
                    padding: "4px",
                    margin: "5px",
                    borderRadius: "6px",
                    display: "inline",
                  }}
                >
                  NO FEE
                </span>
              </p>
            </a>
          </Link>
        </MDBNavbarBrand>
        <MDBHamburgerToggler
          color="#FFCA79"
          id="hamburger1"
          onClick={() => setIsOpen(!isOpen)}
        />
        <MDBCollapse isOpen={isOpen} navbar>
          <MDBNavbarNav left>
            <MDBNavItem>{campaignButton()}</MDBNavItem>
            <MDBNavItem>{loginButton()}</MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>

    // <MDBNavbar style={{ backgroundColor: "#7d73c3" }} expand="md">
    //   <div className={styles.hpMainWrapper}>
    //     <MDBNavbarBrand>
    //       <Link href="/">
    //         <a className="d-md-none" href="#">
    //           <img
    //             src="/images/logo.png"
    //             alt="logo"
    //             className={styles.hpLogo}
    //           />
    //         </a>
    //       </Link>
    //     </MDBNavbarBrand>
    //     <MDBNavbarBrand style={{ fontSize: "1em" }}>
    //       {!isLoggedIn ? (
    //         <a
    //           onClick={() => {
    //             Router.push("/login");
    //           }}
    //         >
    //           <strong
    //             className={`${styles.hpNavStartC} ${styles.hpTransformOnHover} nav-link text-uppercase`}
    //           >
    //             Start Campaign
    //           </strong>
    //         </a>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             Router.push("/newProject");
    //           }}
    //         >
    //           <strong
    //             className={`${styles.hpNavStartC} ${styles.hpTransformOnHover} nav-link text-uppercase`}
    //           >
    //             Start Campaign
    //           </strong>
    //         </a>
    //       )}
    //     </MDBNavbarBrand>
    //     <MDBNavbarToggler
    //       className={styles.hpNavToggler}
    //       onClick={() => setIsOpen(!isOpen)}
    //     />

    //     <MDBCollapse isOpen={isOpen} navbar>
    //       <MDBNavbarNav>
    //         <MDBNavbarBrand className={styles.hpNavItemWrapper}>
    //           <ul className="navbar-nav">
    //             <li className="nav-item">{loginButton()}</li>
    //           </ul>
    //         </MDBNavbarBrand>
    //       </MDBNavbarNav>
    //     </MDBCollapse>
    //   </div>
    // </MDBNavbar>
  );
};

export default withRedux(NavbarPage);
