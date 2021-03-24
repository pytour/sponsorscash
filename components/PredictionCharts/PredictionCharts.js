import React, {useState} from "react";
import {Line, Pie} from "react-chartjs-2";
import {campaigns, pieData} from "./data";

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
    <div className=" pt-12 pb-32 max-w-screen-xl  mx-auto  ">
      <div className="container gird gird-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-12 leading-normal">
          <h1 className="text-4xl text-left ">FundMeToken (FMT)</h1>
          <br />
          <>
            <h2 className="mt-5 text-2xl text-left ">Overview</h2>
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
                className="underline text-blue-400"
              >
                e90e9e632314d7d8ea8151218187a2713804a4670573249daadeccb7f2fed076
              </a>
            </p>
            <p>
              Whitepaper:
             <span> <a href="https://fundme.cash/api/media/files/whitepaper.pdf">
                whitepaper.pdf
             </a> </span>
            </p>
          </>
          <h3 className="mt-5 text-2xl text-left ">Token distribution</h3>
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

          <h1 className="mt-5 text-4xl text-left " >Platform approx. growth prediction charts</h1>
          <br />
          <>
            <h2 className="mt-5 text-2xl text-left ">Briefly</h2>
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
         <div className="w-full h-full">
             <img
            className="p-1 w-full bg-branding-title rounded-sm text-center  mt-4"
            src="static/images/camp-chart.jpg"
            alt="chart"
          />
         </div>
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

        </div>
      </div>
    </div>
  );
};
export default charts;
