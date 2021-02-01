import React from "react";
import { MDBRow } from "mdbreact";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
const BigNumber = require('bignumber.js');
const formatter = buildFormatter(frenchStrings);

import styles from "./sponsors.module.css";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const sponsors = (props) => {
  function formatDate(date) {
    let diff = new Date() - date; // the difference in milliseconds

    if (diff < 1000) {
      // less than 1 second
      return "right now";
    }

    let sec = Math.floor(diff / 1000); // convert diff to seconds

    if (sec < 60) {
      return sec + " sec. ago";
    }

    let min = Math.floor(diff / 60000); // convert diff to minutes
    if (min < 60) {
      return min + " min. ago";
    }

    // format the date
    // add leading zeroes to single-digit day/month/hours/minutes
    let d = date;
    d = [
      "0" + d.getDate(),
      "0" + (d.getMonth() + 1),
      "" + d.getFullYear(),
      "0" + d.getHours(),
      "0" + d.getMinutes(),
    ].map((component) => component.slice(-2)); // take last 2 digits of every component

    // join the components into date
    return d.slice(0, 3).join(".") + " " + d.slice(3).join(":");
  }

  function donationValue(val) {
    val = parseFloat(val);
    if (val < 0.0001) return parseFloat(new BigNumber(val).multipliedBy(10 ** 8))  + ' Satoshi';
    return val + ' BCH';
  }

  return (
    <div className="col-6 col-sm-3 col-md-3 col-lg-3 mb-3">
      <MDBRow className="no-gutters">
        <div className={`${styles.sponsorAvatar}`}>
          <img
            src={
              props.avatar
                ? publicRuntimeConfig.APP_URL + "/media/user/" + props.avatar
                : publicRuntimeConfig.APP_URL + "/media/user/user-avatar.png"
            }
            className="w-100 "
            alt="avatar"
          />
        </div>
        <div className="col-12">
          <div className="sponsor-info d-flex flex-column ">
            {props.username ? (
              <a href={"/" + props.username}>
                <p className={`${styles.sponsorName} text-center`}>
                  {props.name}
                </p>
              </a>
            ) : (
              <p className={`${styles.sponsorName} text-center`}>
                {props.name}
              </p>
            )}

            {props.name == "Anonymous" ? (
              <a href={"https://explorer.bitcoin.com/bch/tx/" + props.tx}>
                <div className={`${styles.sponsorName} text-center`}>
                  <p className={`${styles.sponsorDonation} text-center`}>
                    {props.donation && donationValue(props.donation)}
                  </p>
                  <TimeAgo date={new Date(props.date)} formatter={formatter} />
                </div>
              </a>
            ) : (
              <p className={`${styles.sponsorDonation} text-center`}>
                {props.donation && donationValue(props.donation)}
              </p>
            )}
          </div>
        </div>
      </MDBRow>
    </div>
  );
};

export default sponsors;
