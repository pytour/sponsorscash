import React, { useEffect, useState } from "react";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import Sponsors from "./sponsors";

// import axios from "axios";
// import getConfig from "next/config";
// const { publicRuntimeConfig } = getConfig();

const sponsorPanel = (props) => {
  // TODO fetch data for Last Sponsors tab
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (props.donations) {
      setDonations(props.donations);
      console.log("last donors tab:", donations);
      props.onChangeDonationCount(donations.length);
    }
  }, [props.donations]);

  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol size="12">
          <div className="container">
            <div className="row">
              {donations ? (
                donations.map((el) => {
                  if (el.name) {
                    return (
                      <Sponsors
                        key={el._id}
                        avatar={el.userImage}
                        name={el.name}
                        username={el.username}
                        donation={el.donatedBCH + " BCH"}
                        tx={el.txId}
                        date={el.date}
                      />
                    );
                  } else {
                    //Anonymous donation
                    return (
                      <Sponsors
                        key={el._id}
                        avatar={el.userImage}
                        name="Anonymous"
                        username={el.username}
                        donation={el.donatedBCH + " BCH"}
                        tx={el.txId}
                        date={el.date}
                      />
                    );
                  }
                })
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default sponsorPanel;
