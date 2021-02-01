import React, { useEffect, useState } from "react";
import styles from "./imageGrid.module.css";
import Lightbox from "react-awesome-lightbox";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const imageGrid = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  let allImages = [];

  // useEffect(() => {
  //   if (props.images && props.images[0]) allImages = props.images.map((id) => {
  //     return `${publicRuntimeConfig.APP_URL}/media/project/${id}`;
  //   });
  // }, [props]);
  if (props.images && props.images[0])
    allImages = props.images.map((id) => {
      return `${publicRuntimeConfig.APP_URL}/media/project/${id}`;
    });

  return (
    <>
      <div className={styles.projectMainImg} style={{ cursor: "pointer" }}>
        <img
          src={
            allImages[0]
              ? allImages[0]
              : publicRuntimeConfig.APP_URL + "/media/project/default.jpg"
          }
          alt="image 1"
          className="w-100"
          onClick={() => {
            setImgIndex(0);
            setIsOpen(true);
          }}
        />
      </div>
      {allImages.length > 1 ? (
        <div className="d-flex justify-content-between">
          {allImages.map((link, index) => {
            if (index > 0)
              return (
                <div
                  className={styles.projectMinorImg}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      props.images && props.images[index]
                        ? link
                        : "https://via.placeholder.com/500"
                    }
                    alt={"image " + index}
                    className="w-100 h-100"
                    onClick={() => {
                      setImgIndex(index);
                      setIsOpen(true);
                    }}
                  />
                </div>
              );
          })}
        </div>
      ) : (
        <></>
      )}
      {isOpen &&
        (allImages.length > 1 ? (
          <Lightbox
            images={allImages}
            showTitle="false"
            startIndex={imgIndex}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <Lightbox
            image={allImages[0]}
            showTitle="false"
            startIndex={imgIndex}
            onClose={() => setIsOpen(false)}
          />
        ))}
    </>
  );
};

export default imageGrid;
