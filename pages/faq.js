import React from "react";
import Layout from "../components/Layout";
import { withRedux } from "../lib/redux";
import { MDBContainer } from "mdbreact";
import { Button, Accordion, Card } from "react-bootstrap";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const faq = () => {
  const fee = publicRuntimeConfig.FEE_AMOUNT;
  return (
    <div>
      <Layout>
        <MDBContainer className="mt-5 text-center">
          <h2 className="h1 display-3">FAQ</h2>
          <Accordion style={{ padding: "2rem" }} defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  Is this platform non-custodial?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  No. We do hold campaign funds. If you don’t feel comfortable
                  with this we recommend trying out flipstarter.cash. They offer
                  a non-custodial option. The folks at{" "}
                  <a href="https://t.me/flipstarter">flipstarter</a> have spent
                  a lot of time on this project and are very helpful.
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                  What do you charge for your services?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  We charge {fee}% of funds raised. We had a 5% fee and it has
                  been removed temporarily at the request of the community. We
                  will revisit this in a few months.
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                  What is and isn’t allowed on your platform?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  We don’t want to moderate this platform, but some people just
                  want to watch the world burn. <br />
                  We reserve the right to remove nefarious campaigns and seize
                  funds from those nefarious campaigns at our discretion.
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="3">
                  Who is allowed to create a campaign?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="3">
                <Card.Body>
                  Anybody in any location. We don’t place restrictions on who
                  can use our platform. This is the benefit of using BCH.
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="4">
                  Is there any KYC/AML regulations we need to follow?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="4">
                <Card.Body>
                  We won’t hold any funds ransom to collect any data other than
                  what is required at signup. <br />
                  There is no FIAT involved, just BCH. We see no reason this
                  should be an issue.
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="5">
                  How can I donate to other campaigns?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="5">
                <Card.Body>
                  <ul>
                    <li>
                      Logged in users - Donate with Badger and your name/avatar
                      will be shown in Last Donors tab
                    </li>
                    <br />
                    <li>
                      Anonymous - Any user can click ‘Pay’ and receive the BCH
                      address to send donations. They will appear as Anonymous
                      after one confirmation on the BCH blockchain.
                    </li>
                  </ul>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </MDBContainer>
      </Layout>
      {/* <style jsx>
        {`
        .block-example {
        width: 45%;
        margin: 0.5rem;
        background-color: #eee;
        display: inline-block;
        padding: 50px;
        
      `}
      </style> */}
    </div>
  );
};

export default withRedux(faq);
