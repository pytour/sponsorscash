import React from "react";
import styles from "./smallCard.module.css";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const smallCard = (props) => {
  return (
    <div className={`${styles.projectPreview} container py-3`}>
      <div className="row align-items-center">
        <div className="col-3">
          <div className={styles.imageWrapper}>
            <img
              className={styles.image}
              src={`${publicRuntimeConfig.APP_URL}/media/project/${props.imgSrc}`}
              alt="woman-wearing-animal-print"
            />
          </div>
        </div>
        <div className="col-8 offset-1">
          <div className="text-left">
            <p
              className={`${styles.projectTitle} text-uppercase font-weight-bold text-truncate mb-0`}
            >
              {props.text || 'default text'}
            </p>
            <div className={styles.funded}>
              {props.tag ? (
                <p className={`${styles.hpProjectCategory} text-uppercase`}>
                  {props.tag}
                </p>
              ) : (
                <p></p>
              )}
              <p className="font-weight-bold mb-0">{props.value + ' BCH'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default smallCard;
