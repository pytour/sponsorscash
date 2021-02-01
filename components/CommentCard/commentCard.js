import React from "react";
import styles from "./commentCard.module.css";
import Link from "next/link";
import TimeAgo from "react-timeago";
import engStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();


const formatter = buildFormatter(engStrings);

const commentCard = (props) => {
  return (
    <div className={`${styles.messageCard} p-3 mt-4 mb-4`}>
      <div className="container">
        <div className="row mb-3">
          <div className="col-3 col-sm-2 col-md-1">
            <div className={`d-inline-block`}>
              <img
                src={publicRuntimeConfig.APP_URL + "/media/user/" + props.image}
                alt="user-avatar"
                className={styles.userAvatar}
              />
            </div>
          </div>
          <div className="col-8 col-sm-4 col-md-2">
            <div className="username d-inline-block">
              <Link href={"/" + props.username}>
                <a>
                  <p className={`${styles.userName} mb-0`}>{props.name}</p>
                </a>
              </Link>
              <small className={`${styles.smallTime} d-block`}>
              <TimeAgo date={new Date(props.date)} formatter={formatter} />
              </small>
            </div>
          </div>
        </div>
      </div>
      <p className={`${styles.commentMessage} mb-0`}>{props.text}</p>
    </div>
  );
};

export default commentCard;
