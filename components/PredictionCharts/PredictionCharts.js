import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow } from "mdbreact";
import { Line, Pie } from "react-chartjs-2";
import styles from "./charts.module.css";
import { campaigns, pieData } from "./data";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const charts = () => {
  const [data, setData] = useState();
  const [users, setUsers] = useState();
  const [fmtData, setFmt] = useState();
  const [distrPie, setDistrPie] = useState();
  const [fmtBch, setFmtBch] = useState();

  if (campaigns && !data) {
    let dataObj = {
      labels: [],
      datasets: [
        {
          label: "Total campaigns",
          data: [],
          fill: false,
          backgroundColor: "rgba(153,0,255,1)",
          borderColor: "rgba(153,0,255,0.7)",
        },
        {
          label: "Monthly active campaigns",
          data: [],
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };
    let index = 0;
    for (const el of campaigns) {
      dataObj.labels.push(el.date);
      let curTotal;
      if (dataObj.datasets[0].data.length > 0) {
        curTotal = dataObj.datasets[0].data[index - 1] + el.count;
      } else {
        curTotal = el.count;
      }
      dataObj.datasets[0].data.push(curTotal);
      dataObj.datasets[1].data.push(el.count);
      index++;
    }
    setData(dataObj);
  }

  if (campaigns && !users) {
    let dataObj = {
      labels: [],
      datasets: [
        {
          label: "Total users",
          data: [],
          fill: false,
          backgroundColor: "rgba(153,0,255,1)",
          borderColor: "rgba(153,0,255,0.7)",
        },
      ],
    };
    console.log("chart", campaigns.length);
    let index = 0;
    for (const el of campaigns) {
      dataObj.labels.push(el.date);
      let curTotal;
      let activeUsers = el.count * 10 + 50;
      if (dataObj.datasets[0].data.length > 0) {
        curTotal = dataObj.datasets[0].data[index - 1] + activeUsers;
      } else {
        curTotal = activeUsers;
      }
      dataObj.datasets[0].data.push(curTotal);
      index++;
    }
    setUsers(dataObj);
  }

  if (campaigns && !fmtData) {
    let dataObj = {
      labels: [],
      datasets: [
        {
          label: "Total BCH ads deposits",
          data: [],
          fill: false,
          backgroundColor: "rgba(153,0,255,1)",
          borderColor: "rgba(153,0,255,0.7)",
        },
        {
          label: "BCH ads deposits per month",
          data: [],
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };
    console.log("chart", campaigns.length);
    let index = 0;
    for (const el of campaigns) {
      dataObj.labels.push(el.date);
      let curTotal;
      let bid = getRandomArbitrary(10000, (index + 1) * 10000000);

      let fmtCampDep = el.count + Math.floor((30 * bid * el.count) / 3); // Satoshi
      fmtCampDep = fmtCampDep / 10 ** 8;

      if (dataObj.datasets[0].data.length > 0) {
        curTotal = dataObj.datasets[0].data[index - 1] + fmtCampDep;
      } else {
        curTotal = fmtCampDep;
      }
      dataObj.datasets[0].data.push(curTotal); // Total for all time
      dataObj.datasets[1].data.push(fmtCampDep); // Total per month
      index++;
    }
    setFmt(dataObj);
  }

  if (campaigns && fmtData && !fmtBch) {
    let dataObj = {
      labels: [],
      datasets: [
        {
          label: "FMT / BCH (Satoshi)",
          data: [],
          fill: false,
          backgroundColor: "rgba(153,0,255,1)",
          borderColor: "rgba(153,0,255,0.7)",
        },
        {
          label: "Market cap in BCH",
          data: [],
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };
    let index = 0;
    const totalFMTtokens = 45000000;
    const initFMTprice = 1000;

    console.log("bch total", fmtData.datasets[0].data);
    console.log("bch per mnth", fmtData.datasets[1].data);
    for (const el of fmtData.datasets[0].data) {
      dataObj.labels.push(campaigns[index].date);
      let curTotal;

      let price = (el * 10 ** 8) / totalFMTtokens + initFMTprice;

      // if (dataObj.datasets[0].data.length > 0) {
      //   curTotal = dataObj.datasets[0].data[index - 1] + price;
      // } else {
      //   curTotal = price;
      // }
      // dataObj.datasets[0].data.push(curTotal); // Total for all time
      dataObj.datasets[0].data.push(price); // Total per month
      dataObj.datasets[1].data.push((price * totalFMTtokens) / 10 ** 8); // Total per month

      index++;
    }
    setFmtBch(dataObj);
  }

  if (pieData && !distrPie) {
    setDistrPie(pieData);
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  return (
    <MDBContainer
      style={{
        maxWidth: "100%",
        backgroundColor: "rgba(187,187,187,0.4)",
        paddingTop: "50px",
        paddingBottom: "150px",
      }}
    >
      <MDBRow>
        <div className="col-12 col-md-8 mx-auto">
          <h1>FundMeToken (FMT)</h1>
          <br />
          <>
            <h2>Overview</h2>
            <p>
              FMT will be used to airdrop website profits to all token holders.
            </p>
            <p>Total coins: 45,000,000 FMT</p>
            <p>Decimals: 3</p>
            <p>FMT flipstarter price: 1 FMT - 1000 Satoshi</p>
            <p>
              Token ID:{" "}
              <a
                href="https://simpleledger.info/#token/e90e9e632314d7d8ea8151218187a2713804a4670573249daadeccb7f2fed076"
                target="_blank"
              >
                e90e9e632314d7d8ea8151218187a2713804a4670573249daadeccb7f2fed076
              </a>
            </p>
            <p>
              Whitepaper:{" "}
              <a href="https://fundme.cash/api/media/files/whitepaper.pdf">
                whitepaper.pdf
              </a>
            </p>
          </>
          <h3 className="mt-5">Token distribution</h3>
          <p>
            Our FMT distribution is as follows:
            <br />
            10% to Flipstarter donations
            <br />
            40% for rewards/sales on our swap page
            <br />
            50% for our team to use on future development
          </p>
          {data ? <Pie data={distrPie} /> : ""}

          <h1>Platform approx. growth prediction charts</h1>
          <br />
          <>
            <h2>Briefly</h2>
            <p>Here we will use example data to see platform growth charts</p>
            <p>platform growth conditioned by FundMe rewards system</p>
            <p>Prediction trending line based on quadratic function:</p>
            <code>
              <b>a * x^2 + b * x + c <br />
              1.28 * x^2 + 4.85 * x + 28.37</b>
            </code>
          </>
          {/* <h3 className="mt-5">Campaigns chart</h3>
          {data ? <Line data={data} options={options} /> : ""}
          <br /> */}
          <img
            className={`${styles.imageChart} d-block mt-4`}
            src="static/images/camp-chart.jpg"
            alt="chart"
          />
          {/* <h3 className="mt-5">Users chart</h3>
          {users ? <Line data={users} options={options} /> : ""} */}
          <br />
          <div>
            <h3 className="mt-5">BCH platform earnings chart</h3>
            <p>
              <i>
                Approximate prediction for BCH returns from advertisiment
                bidding system
              </i>
            </p>
            <p>
              <i>Calculated as 30 Days x BID BUDGET x (NumCampaigns / 3)</i>
            </p>
            <i>
              where BID BUDGET random value from 10 000 Satoshi to MONTH x 10
              000 000 Satoshi
            </i>
            <br />
            <br />
            {fmtData ? <Line data={fmtData} options={options} /> : ""}
          </div>

          {/* <div>
            <h3 className="mt-5">FMT / BCH chart</h3>
            <p>
              <i>Approximate prediction for FMT / BCH price chart</i>
            </p>
            <p>
              <i>
                Calculated as TOTAL BCH DEPOSITS / TOTAL FMT TOKENS + FMT INIT
                PRICE
              </i>
            </p>
            <i>
              where BCH DEPOSITS returns from Ads system (based on chart above)
            </i>
            <br />
            <br />
            {fmtBch ? <Line data={fmtBch} /> : ""}
          </div> */}
        </div>
      </MDBRow>
    </MDBContainer>
  );
};
export default charts;
