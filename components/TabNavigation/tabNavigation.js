import React, { Component } from "react";
import {
  MDBContainer,
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBRow,
  MDBCol,
  MDBBadge,
} from "mdbreact";
import styles from "./tabNavigation.module.css";
import ProjectDetailPanel from "../TabPanels/projectDetailPanel";
import SponsorPanel from "../TabPanels/sponsorPanel";
import FeedbackPanel from "../TabPanels/feedbackPanel";

class tabNavigation extends Component {
  state = {
    activeItem: "1",
    active: false,
    donationsCount: 0,
    commentsCount: 0,
  };

  

  toggle = (tab) => (e) => {
    if (this.state.activeItem !== tab) {
      this.setState({
        activeItem: tab,
        active: true,
      });
    }
  };
  handleDonChange = (newVal) => {
    this.setState({ donationsCount: this.props.donations.length });
  };
  handleComChange = (newVal) => {
    this.setState({ commentsCount: newVal });
  };
  render() {
    let active = styles.tab1;
    //console.log("!!props: ", this.props);  
    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol size="12" className="mb-4">
            <MDBNav style={{ border: "none" }} className="nav-tabs">
              <MDBNavItem>
                <p
                  className={`${styles.tab} ${
                    this.state.activeItem === "1" ? active : ""
                  }`}
                  onClick={this.toggle("1")}
                  role="tab"
                >
                  Project Details
                </p>
              </MDBNavItem>
              <MDBNavItem>
                <p
                  className={`${styles.tab} ${
                    this.state.activeItem === "2" ? active : ""
                  }`}
                  onClick={this.toggle("2")}
                  role="tab"
                >
                  Last Donors{" "}
                  <MDBBadge color="grey" className="ml-2">
                    {this.props.donations && this.props.donations.length > 0 && this.state.donationsCount}
                  </MDBBadge>
                </p>
              </MDBNavItem>
              <MDBNavItem>
                <p
                  className={`${styles.tab} ${
                    this.state.activeItem === "3" ? active : ""
                  }`}
                  onClick={this.toggle("3")}
                  role="tab"
                >
                  Feedback{" "}
                  <MDBBadge color="grey" className="ml-2">
                    {this.state.commentsCount > 0 && this.state.commentsCount}
                  </MDBBadge>
                </p>
              </MDBNavItem>
            </MDBNav>
          </MDBCol>
          <MDBTabContent activeItem={this.state.activeItem}>
            <MDBTabPane tabId="1" role="tabpanel">
              <ProjectDetailPanel
                details={this.props.project}
                projectCreator={this.props.projectCreator}
              />
            </MDBTabPane>
            <MDBTabPane tabId="2" role="tabpanel">
              <SponsorPanel
                projectId={this.props.project._id}
                onChangeDonationCount={this.handleDonChange}
                donations={this.props.donations}
              />
            </MDBTabPane>
            <MDBTabPane tabId="3" role="tabpanel">
              <FeedbackPanel projectId={this.props.project._id}
                onChangeCommentCount={this.handleComChange} />
            </MDBTabPane>
          </MDBTabContent>
        </MDBRow>
      </MDBContainer>
    );
  }
}
export default tabNavigation;
