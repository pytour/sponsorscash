import React from "react";
import Layout from "../components/Layout";
import { withRedux } from "../lib/redux";
import { MDBContainer, MDBAlert } from 'mdbreact';
const About = () => (
  <div>
    <Layout>
        <MDBContainer>
            <MDBAlert color="primary" >
                A simple primary alert—check it out!
            </MDBAlert>
        </MDBContainer>
    </Layout>
  </div>
);

export default withRedux(About);