import React, { useEffect, useState, useRef } from "react";
import styles from "./projectDescription.module.css";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import axios from "axios";
import * as Swal from "sweetalert2";
const bitboxSDK = require("bitbox-sdk").BITBOX;
const BITBOX = new bitboxSDK();
import { useSelector } from "react-redux";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import Countdown from "react-countdown";
import {
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const projectDescription = (props) => {
  const [modal, setModal] = useState(false);
  const [modalShare, setModalShare] = useState(false);
  const [amount, setAmount] = useState(0);
  const [funded, setFunded] = useState(0);
  // const [fee, setFee] = useState(0);
  const [isNotCompleted, setIsNotCompleted] = useState(true);
  const token = useSelector((state) => state.token);
  const username = useSelector((state) => state.username);
  const userId = useSelector((state) => state.id);
  const name = useSelector((state) => state.name);
  const image = useSelector((state) => state.image);
  const [copySuccess, setCopySuccess] = useState("");
  const textAreaRef = useRef(null);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    setCopySuccess("Copied!");
  }

  useEffect(() => {
    if (props.id) {
      // console.log("description prop", props);
      axios
        .post(publicRuntimeConfig.APP_URL + "/project/checkGoalStatus", {
          id: props.id,
        })
        .then((res) => {
          // console.log("is hitted: ", res.data.status);
          if (res.data.status === 201) {
            console.log("PROJECT GOAL HITTED");
            // Goal hitted ,but Countdown may be not ended then donations active
            setIsNotCompleted(false);
          }
          if (true) {
            // if (!props.hasEnded)
            axios
              .post(publicRuntimeConfig.APP_URL + "/project/checkFunds", {
                projectID: props.id,
              })
              .then((funds) => {
                if (funds.data.status === 200) {
                  console.log("projDescription checkFunds:", funds.data.funded);
                  let fundedVal =
                    funds.data.funded > props.funded
                      ? funds.data.funded
                      : props.funded;
                  setFunded(fundedVal);
                } else if (funds.data.status === 400) {
                  console.log(
                    "projDescription :: Error at checkFunds:",
                    funds.data.message
                  );
                  setFunded(props.funded);
                }
              })
              .catch((err) => {
                console.log(
                  "projDescription:: Error at checkFunds: ",
                  err.message
                );
                setFunded(props.funded);
              });
          } else {
            setFunded(props.funded);
          }
        })
        .catch((err) => console.log("Error at checkGoalStatus: ", err.message));
    } else {
      setFunded(props.funded);
    }
  }, [props.id]);

  useEffect(() => {
    setFunded(props.funded);
  }, [props.funded]);

  const sendBch = () => {
    if (!token || !username) {
      Swal.fire(
        "Login first",
        "To pay with Badger please login to Fundme.cash",
        "error"
      );
      return;
    }
    if (amount < publicRuntimeConfig.MINIMUM_AMOUNT) {
      Swal.fire("Dust Amount", "Amount must be at least 0.0002 BCH", "error");
      return;
    }
    if (typeof web4bch !== "undefined") {
      web4bch = new Web4Bch(web4bch.currentProvider);

      let txParams = {
        to: props.projCashAddress,
        from: web4bch.bch.defaultAccount,
        value: BITBOX.BitcoinCash.toSatoshi(amount),
        opReturn: {
          data: ["0x6d02", "Fundmecash"],
        },
      };

      web4bch.bch.sendTransaction(txParams, (err, txid) => {
        if (err) {
          console.log("send err", err);
        } else {
          axios
            .post(publicRuntimeConfig.APP_URL + "/project/updateFunds", {
              projectID: props.id,
              amount: amount,
            })
            .then((res1) => {
              if (res1.data.status === 201) {
                setIsNotCompleted(false);
              }
              // save this donation to donations db!
              console.log("save this donation to donations db!");
              axios
                .post(
                  publicRuntimeConfig.APP_URL + "/donations/createDonation",
                  {
                    title: props.title,
                    image: props.images ? props.images[0] : "",
                    txId: txid,
                    donatedBCH: parseFloat(amount).toFixed(8),
                    projectId: props.id,
                    userId: userId,
                    name: name, // FROM
                    username: username,
                    userImage: image,
                    address: txParams.from,
                  }
                )
                .then((res) => {
                  console.log("donation success for user:", username);
                  console.log("txId:", txid);
                  // add this donation to projSponsorsTab
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
          console.log("send success, transaction id:", txid);
        }
      });
    }
  };

  const pay = () => {
    if (amount < publicRuntimeConfig.MINIMUM_AMOUNT) {
      Swal.fire("Dust Amount", "Amount must be at least 0.0002 BCH", "error");
    }
    // Return cashAddress for this project
    Swal.fire("Campaign Cash Address:", props.projCashAddress, "info");
  };

  let endTime = props.endTime ? props.endTime.split(".")[0] : "";

  const calcFees = (e) => {
    let amount = parseFloat(e.target.value);
    let fees = amount * (publicRuntimeConfig.FEE_AMOUNT / 100);
    let depositAmount = (amount * 100 - fees * 100) / 100;
    depositAmount = parseFloat(depositAmount).toFixed(8);
    setAmount(+depositAmount);
  };
  const countdownTimer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setIsNotCompleted(false);
      axios
        .post(publicRuntimeConfig.APP_URL + "/project/setCompletion", {
          projectID: props.id,
          ended: true,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log("Error at setCompletion: ", err.message));
      return (
        <div>
          <h4>project ended</h4>
        </div>
      );
    } else {
      return (
        <ul className="p-0 mb-0">
          <li className={styles.countDownTimerLi}>
            <span
              className={`${styles.countDownTimerSpan} ${styles.countDownDaysHours}`}
            >
              {days}
            </span>
            :
          </li>
          <li className={styles.countDownTimerLi}>
            <span
              className={`${styles.countDownTimerSpan} ${styles.countDownDaysHours}`}
            >
              {hours}
            </span>
            :
          </li>
          <li className={styles.countDownTimerLi}>
            <span
              className={`${styles.countDownTimerSpan} ${styles.countDownMinsSec}`}
            >
              {minutes}
            </span>
            :
          </li>
          <li className={styles.countDownTimerLi}>
            <span
              className={`${styles.countDownTimerSpan} ${styles.countDownMinsSec}`}
            >
              {seconds}
            </span>
          </li>
        </ul>
      );
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mt-3 mt-lg-0">
        <p className={`${styles.projectTitle} text-uppercase font-weight-bold`}>
          {props.title}
        </p>
        <p className={styles.hpProjectCategory}>{props.category}</p>
      </div>

      <p className={styles.projectText}>{props.description}</p>

      <div className="text-center text-lg-left mb-3">
        <div
          className={`${styles.countDownTimer} d-lg-inline-block text-center mx-auto mr-lg-5 mb-3`}
        >
          {props.endTime && isNotCompleted ? (
            <Countdown date={endTime} renderer={countdownTimer} />
          ) : (
            <h5>This campaign has ended</h5>
          )}

          <p className={`${styles.fundEnds} text-uppercase text-center mb-0`}>
            funding ends
          </p>
        </div>
        <div className="donations d-lg-inline-block text-center">
          <div className={`${styles.funded} d-inline-block pr-3 border-right`}>
            <p style={{ fontSize: "1.3rem" }} className="font-weight-bold mb-0">
              {funded ? +parseFloat(funded).toFixed(8) : 0} BCH
            </p>
            <p className="text-uppercase mb-0">funded</p>
          </div>
          <div className={`${styles.goal} d-inline-block pl-3`}>
            <p style={{ fontSize: "1.3rem" }} className="font-weight-bold mb-0">
              {props.goal} BCH
            </p>
            <p className="text-uppercase mb-0">goal</p>
          </div>
        </div>
      </div>

      <div className="text-center text-lg-left">
        {props.status === "CANCELED" && (
          <p className="text-uppercase d-block">Campaign cancelled</p>
        )}
        {props.status !== "CANCELED" && isNotCompleted && (
          <button
            type="button"
            onClick={() => {
              setModal(!modal);
            }}
            className={`${styles.btnDonate} btn text-uppercase d-block d-lg-inline-block mx-auto mr-lg-4 mb-3 mb-lg-0`}
          >
            donate now
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setModalShare(!modalShare);
          }}
          className={`${styles.btnDonate} btn text-uppercase d-block d-lg-inline-block mx-auto mr-lg-4 mb-3 mb-lg-0`}
        >
          share
        </button>
      </div>
      <MDBModal isOpen={modal} toggle={setModal} centered>
        <MDBModalHeader>Donate</MDBModalHeader>
        <MDBModalBody>
          <div>
            <strong>Enter Amount:</strong>
            <input className={styles.hpInput} onChange={calcFees} type="text" />
          </div>
          <div>
            <strong>Platform Fee: {publicRuntimeConfig.FEE_AMOUNT}%</strong>
          </div>
          <div>
            <strong>Sponsoree receive: {amount}</strong>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            color="secondary"
            onClick={() => {
              setModal(false);
            }}
          >
            Close
          </MDBBtn>
          <MDBBtn color="primary" onClick={sendBch}>
            Pay with Badger
          </MDBBtn>
          <MDBBtn color="primary" onClick={pay}>
            Pay
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
      <MDBModal isOpen={modalShare} toggle={setModalShare} centered>
        <MDBModalHeader>SHARE</MDBModalHeader>
        <MDBModalBody>
          <div className="text-center">
            <TelegramShareButton
              url={`https://fundme.cash/project/${props.id}`}
              quote={props.title}
              className={styles.btnShareSmall}
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <FacebookShareButton
              url={`https://fundme.cash/project/${props.id}`}
              quote={props.title}
              className={styles.btnShareSmall}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://fundme.cash/project/${props.id}`}
              quote={props.title}
              className={styles.btnShareSmall}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <div>
              {
                /* Logical shortcut for only displaying the 
          button if the copy command exists */
                document.queryCommandSupported("copy") && (
                  <div className="p-2">
                    <MDBBtn color="primary" onClick={copyToClipboard}>
                      Copy URL
                    </MDBBtn>
                    {copySuccess}
                  </div>
                )
              }
              <form>
                <textarea
                  ref={textAreaRef}
                  value={`https://fundme.cash/project/${props.id}`}
                />
              </form>
            </div>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            color="secondary"
            onClick={() => {
              setModalShare(false);
            }}
          >
            Close
          </MDBBtn>
          {/* <MDBBtn color="primary" onClick={pay}>
            Pay
          </MDBBtn> */}
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};

export default projectDescription;
