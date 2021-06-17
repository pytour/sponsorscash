import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import getConfig from 'next/config';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true
                }
            }
        ]
    }
};
const stats = () => {
    const [campaigns, setCampaigns] = useState();
    const [usersStats, setUserStats] = useState();
    const [stats, setStats] = useState();
    const [data, setData] = useState();
    const [usersChart, setUsersChart] = useState();
    const [campaignsChart, setCampaignsChart] = useState();
    useEffect(() => {
        axios
            .get(publicRuntimeConfig.API_URL + '/project/getAllProjects')
            .then(res => {
                let arr = res.data.projects;
                console.log('Campaigns', arr);
                arr = arr.sort(
                    (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
                );
                arr = arr.filter(el => {
                    if (new Date(el.endTime).getTime() < new Date().getTime()) return el;
                });
                arr = arr.map(el => {
                    return {
                        funded: el.funded,
                        endTime: el.endTime.split('T')[0].substr(0, 7),
                        startTime: el.startTime.split('T')[0].substr(0, 7),
                        goal: el.goal,
                        title: el.title
                    };
                });
                console.log('Campaigns sorted', arr);

                setCampaigns(arr);

                let totalFundedCount = 0;
                let totalFundedBch = 0;
                res.data.projects.forEach(el => {
                    totalFundedBch += el.funded;
                    if (el.goal > 0 && el.funded >= el.goal) totalFundedCount++;
                });
                setStats({
                    count: res.data.projects.length,
                    totalFundedCount: totalFundedCount,
                    totalFundedBch: totalFundedBch
                });
            })
            .catch(err => err);
        axios
            .get(publicRuntimeConfig.API_URL + '/users/stats')
            .then(res => {
                setUserStats({
                    count: res.data.count,
                    registerDates: res.data.registerDates,
                    sponsoreesCount: res.data.sponsoreesCount
                });
            })
            .catch(err => err);
    }, []);

    if (campaigns && !data) {
        let dataObj = {
            labels: [],
            datasets: [
                {
                    label: 'Total BCH',
                    data: [],
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)'
                }
            ]
        };

        let campDates = []; // Total funded for each month
        campaigns.forEach(el => {
            if (el.funded > 0 && el.endTime) {
                let date = el.endTime;
                let funded = el.funded;
                // console.log(date, funded);
                // Chech if date already exists
                let isDateExists;
                for (const obj of campDates) {
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key) && key === date) {
                            // let totalfunded = obj[key];
                            // Exists
                            isDateExists = true;
                            // Update total
                            obj[key] += funded;
                        }
                    }
                }
                let dateObj = new Object();
                dateObj[date] = funded;
                if (!isDateExists) campDates.push(dateObj);
            }
        });
        console.log('chart', campaigns);
        console.log('updated stats', campDates);

        // let index = 0;
        // for (const el of campaigns) {
        //   if (el.funded > 0 && el.endTime) {
        //     dataObj.labels.push(el.endTime);
        //     let curTotal;
        //     if (dataObj.datasets[0].data.length > 0) {
        //       curTotal = dataObj.datasets[0].data[index - 1] + el.funded;
        //     } else {
        //       curTotal = el.funded;
        //     }
        //     dataObj.datasets[0].data.push(curTotal);
        //     index++;
        //   }
        // }
        let index = 0;
        for (const el of campDates) {
            for (const key in el) {
                if (el.hasOwnProperty(key)) {
                    const date = key;
                    const funded = el[key];
                    if (funded > 0 && date) {
                        dataObj.labels.push(date);
                        let curTotal;
                        if (dataObj.datasets[0].data.length > 0) {
                            curTotal = dataObj.datasets[0].data[index - 1] + funded;
                        } else {
                            curTotal = funded;
                        }
                        dataObj.datasets[0].data.push(curTotal);
                        index++;
                    }
                }
            }
        }
        setData(dataObj);
        //console.log(data);
    }

    if (usersStats && !usersChart) {
        // TODO
        // Concatinate numbers for each month
        //
        let dataObj = {
            labels: [], // Date
            datasets: [
                {
                    label: 'Total users',
                    data: [], // BCH
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)'
                }
            ]
        };
        //console.log("stats", usersStats.registerDates);
        let regDates = [];
        usersStats.registerDates.forEach(el => {
            let date;
            let count = 0;
            // el - {2020-03-11: 1} - date: count
            for (const key in el) {
                if (el.hasOwnProperty(key)) {
                    count = el[key];
                    date = key.substr(0, 7);
                }
            }
            // Chech if date already exists
            let isDateExists;
            for (const obj of regDates) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key) && key.substr(0, 7) === date) {
                        let totalCount = obj[key];
                        // Exists
                        isDateExists = true;
                        // Update total
                        obj[key] += count;
                    }
                }
            }
            let dateObj = new Object();
            dateObj[date] = count;
            if (!isDateExists) regDates.push(dateObj);
        });
        //console.log("updated stats",regDates);

        let index = 0;

        for (const regObj of regDates) {
            for (const date in regObj) {
                if (regObj.hasOwnProperty(date)) {
                    const element = regObj[date];
                    dataObj.labels.push(date);
                    let curTotal = 0;
                    if (dataObj.datasets[0].data.length > 0) {
                        curTotal = dataObj.datasets[0].data[index - 1] + element;
                    } else {
                        curTotal = element;
                    }
                    dataObj.datasets[0].data.push(curTotal);
                }
            }
            index++;
        }

        //console.log(dataObj);
        setUsersChart(dataObj);
        //console.log(usersStats, dataObj.datasets[0].data);
    }

    if (campaigns && !campaignsChart) {
        // setCampaignsChart

        let dataObj = {
            labels: [], // Date
            datasets: [
                {
                    label: 'Total campaigns',
                    data: [],
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)'
                }
            ]
        };
        let regDates = [];
        campaigns.forEach(el => {
            let date = el.startTime;
            // Chech if date already exists
            let isDateExists;
            for (const obj of regDates) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key) && key === date) {
                        // Exists
                        isDateExists = true;
                        // Update total
                        obj[key] += 1;
                    }
                }
            }
            let dateObj = new Object();
            dateObj[date] = 1;
            if (!isDateExists) regDates.push(dateObj);
        });
        //console.log("updated stats",regDates);

        let index = 0;
        for (const regObj of regDates) {
            for (const date in regObj) {
                if (regObj.hasOwnProperty(date)) {
                    const element = regObj[date];
                    dataObj.labels.push(date);
                    let curTotal = 0;
                    if (dataObj.datasets[0].data.length > 0) {
                        curTotal = dataObj.datasets[0].data[index - 1] + element;
                    } else {
                        curTotal = element;
                    }
                    dataObj.datasets[0].data.push(curTotal);
                }
            }
            index++;
        }
        //console.log(dataObj);
        setCampaignsChart(dataObj);
    }

    return (
        <div className=" bg-gray-100 ">
            <div className="max-w-screen-xl container  pt-12 pb-20 mx-auto">
                <div className="grid grid-cols ">
                    <h1 className="text-4xl text-branding-text-color">Platform Stats</h1>
                    <br />
                    <>
                        <h2 className="text-2xl text-branding-text-color">Overview</h2>
                        {stats && usersStats ? (
                            <div className="leading-tight ">
                                Total campaigns: {campaigns.length}
                                <br />
                                Total raised: {Math.floor(stats.totalFundedBch)} BCH <br />
                                Total completed Campaings: {stats.totalFundedCount} (
                                {Math.floor((100 * stats.totalFundedCount) / campaigns.length)}
                                %)
                                <br />
                                Total users: {usersStats.count}
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                    <h3 className="text-3xl mt-5">BCH raised chart</h3>
                    {data ? <Line data={data} options={options} /> : ''}
                    <h3 className="text-3xl mt-5">Total campaigns chart</h3>
                    {campaignsChart ? <Line data={campaignsChart} options={options} /> : ''}
                    <h3 className="text-3xl mt-5">Total users chart</h3>
                    {usersChart ? <Line data={usersChart} options={options} /> : ''}
                    <br />
                    <br />
                    <h2 className="text-3xl">Completed campaigns</h2>
                    <div>
                        <table>
                            <tr>
                                <th>Date</th>
                                <th>Goal</th>
                                <th>Funded</th>
                                <th>Title</th>
                            </tr>
                        </table>
                        <table>
                            {campaigns
                                ? campaigns
                                      .sort((a, b) => b.funded - a.funded)
                                      .map((el, index) => {
                                          if (el.goal > 0 && el.funded >= el.goal)
                                              return (
                                                  <tr key={el.title}>
                                                      <td>{el.endTime.split('T')[0]}</td>
                                                      <td>{el.goal}</td>
                                                      <td>{el.funded}</td>
                                                      <td>{el.title}</td>
                                                  </tr>
                                              );
                                      })
                                : ''}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default stats;
