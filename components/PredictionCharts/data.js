/**
 * Active campaigns per month
 */
export const campaigns = [
  // +2 p/m
  {
    date: "2021-01-01",
    count: 5,
  },
  {
    date: "2021-02-01",
    count: 7,
  },
  {
    date: "2021-03-01",
    count: 9,
  },
  {
    date: "2021-04-01",
    count: 11,
  },
  // +3 p/m
  {
    date: "2021-05-01",
    count: 14,
  },
  {
    date: "2021-06-01",
    count: 17,
  },
  {
    date: "2021-07-01",
    count: 20,
  },
  {
    date: "2021-08-01",
    count: 23,
  },
  // +4 p/m
  {
    date: "2021-09-01",
    count: 27,
  },
  {
    date: "2021-10-01",
    count: 31,
  },
  {
    date: "2021-11-01",
    count: 35,
  },
  {
    date: "2021-12-01",
    count: 39,
  },
];


export const pieData = {
  labels: ['Development Team', 'Flipstarter Participants', 'For platform rewards/swap page' ],
  datasets: [
    {
      label: '# of Votes',
      data: [22500000, 4500000, 18000000],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
}