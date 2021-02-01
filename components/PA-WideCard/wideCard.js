import React, { useEffect, useState } from "react";
import styles from "./wideCard.module.css";
import Countdown from "react-countdown";
import { MDBBtn } from "mdbreact";
import Router from "next/router";
import axios from "axios";
import getConfig from "next/config";
import { useSelector } from "react-redux";
import * as Swal from "sweetalert2";

const { publicRuntimeConfig } = getConfig();

const wideCard = (props) => {
  const dispatch = props.dispatch
  const token = useSelector((state) => state.token);
  const [isNotCompleted, setIsNotCompleted] = useState(true);
  const [transactionCleared, setTransactionCleared] = useState(false);
  useEffect(() => {
    axios
      .post(publicRuntimeConfig.APP_URL + "/project/checkGoalStatus", {
        id: props.projectID,
      })
      .then((res) => {
        if (res.data.status === 201) {
          setIsNotCompleted(false);
          if (res.data.cleared) {
            setTransactionCleared(true);
          }
        } else if (res.data.status === 200) {
          if (res.data.cleared) {
            setTransactionCleared(true);
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const countdownTimer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setIsNotCompleted(false);
      return (
        <div>
          <h6>This Project Has Ended</h6>
        </div>
      );
    } else {
      return (
        <ul className="p-0 mb-0">
          <li className={styles.countDownTimerli}>
            <span className={styles.days}>{days}</span>:
          </li>
          <li className={styles.countDownTimerli}>
            <span className={styles.hours}>{hours}</span>:
          </li>
          <li className={styles.countDownTimerli}>
            <span className={styles.mins}>{minutes}</span>:
          </li>
          <li className={styles.countDownTimerli}>
            <span className={styles.seconds}>{seconds}</span>
          </li>
        </ul>
      );
    }
  };
  let endTime = props.fundingEnds ? props.fundingEnds.split(".")[0] : "";
  const handleProjectDetailsRoute = () => {
    const project_id = props.projectID;
    Router.push(`/project/[id]`, `/project/${project_id}`, {
      shallow: true,
    });
  };
  const withDrawFunds = () => {
    //TODO: Aks user to enter BCH address in input field
    // Then check address (isBCHaddress)
    // if Ok then make withdraw transaction
    // else "Error it is looks like you enter wrong BCH address, check it again"
    // Add new api route /isBchAddress

    Swal.fire({
      title: "Enter your Bitcoin Cash address",
      input: "text",
      inputValue: "",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write BCH address! For example bitcoincash:qwerty123456qwerty123456";
        }
      },
    }).then((result) => {
      let bchAddress = result.value;
      if (bchAddress) {
        // 1 Check bchAddress
        axios
          .post(publicRuntimeConfig.APP_URL + "/project/isBchAddress", {
            bchAddress: bchAddress,
          })
          .then((isBchResult) => {
            if (isBchResult.data.status === 200) {
              // Swal.fire(`Your BCH address:`, `${bchAddress}`, "success");
              // 2 Make withdraw transaction
              axios
                .post(
                  publicRuntimeConfig.APP_URL + "/project/withDrawFunds",
                  {
                    id: props.projectID,
                    bchAddress: bchAddress,
                  },
                  { headers: { Authorization: "Bearer " + token } }
                )
                .then((withdrawResult) => {
                  if (withdrawResult.data.status === 200) {
                    setTransactionCleared(true);
                    Swal.fire("Done", withdrawResult.data.message, "success");
                  } else {
                    Swal.fire("Whoops", withdrawResult.data.message, "error");
                  }
                });
            } else if (isBchResult.data.status === 400) {
              Swal.fire(
                `Error:${isBchResult.data.message}`,
                `Please check your address: ${bchAddress}`,
                "error"
              );
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };
  const cancelProject = () => {
    axios
      .post(
        publicRuntimeConfig.APP_URL + "/project/cancelProject",
        {
          projectId: props.projectID,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        if (res.data.status === 200) {
          setTransactionCleared(true);
          dispatch({ type: "CANCEL_PROJECT", payload: props.projectID });
          Swal.fire("Done", res.data.message, "success");
        } else {
          Swal.fire("Whoops", res.data.message, "error");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={`${styles.project} py-3 px-lg-5`}>
      <div className="container">
        <div className="row align-items-center">
          <div
            style={{ cursor: "pointer" }}
            className="col-lg-6"
            onClick={handleProjectDetailsRoute}
          >
            <div className="row">
              <div className="col-12 col-lg-2 pl-0">
                <div className={`${styles.projectImg} m-auto`}>
                  <img
                    className={styles.projectImgInner}
                    src={`${publicRuntimeConfig.APP_URL}/media/project/${props.imgSrc}`}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="text-center text-lg-left">
                  <p
                    className={`${styles.projectTitle} text-uppercase font-weight-bold text-truncate`}
                  >
                    {props.title}
                  </p>
                  <p
                    className={`${styles.projectCategory} my-lg-0 mx-auto mx-lg-0`}
                  >
                    {props.category}
                  </p>
                </div>
              </div>
              <div className="col-12 col-lg-5 mb-3 mb-lg-0">
                <div className={styles.cardFooter}>
                  <div className="donations text-center">
                    <div
                      className={`${styles.funded} d-inline-block px-0 border-right`}
                    >
                      <p className="font-weight-bold mb-0">
                        {props.funded.toFixed(5)} BCH
                      </p>
                      <p className="text-uppercase mb-0">funded</p>
                    </div>
                    <div className={`${styles.goal} d-inline-block px-0`}>
                      <p className="font-weight-bold mb-0">{props.goal} BCH</p>
                      <p className="text-uppercase mb-0">goal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className={`${styles.countDownTimer} text-center mx-3`}>
                  {props.fundingEnds && isNotCompleted ? (
                    <Countdown date={endTime} renderer={countdownTimer} />
                  ) : transactionCleared ? (
                    <h6>Transaction Cleared</h6>
                  ) : (
                    <MDBBtn
                      className={styles.customColor}
                      onClick={withDrawFunds}
                    >
                      WITHDRAW
                    </MDBBtn>
                  )}

                  <p
                    className={`${styles.timerText} text-uppercase text-center mb-0`}
                  >
                    funding end{isNotCompleted ? "s" : "ed"}
                  </p>
                </div>
              </div>
              <div className="close-project col-12 col-lg-4 text-center">
                <button
                  type="button"
                  className={`${styles.btnClose} btn`}
                  title="Close this project"
                >
                  {/* <img style={{width:'2rem'}} src={props.lastBtn} alt="cancel"/> */}
                  <a className={styles.cancelBtn} onClick={cancelProject}>
                    CANCEL
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default wideCard;
