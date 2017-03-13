import React from 'react';
// import _ from 'lodash';

const data = [
  ["2017-01-01", ["44", "44", "43", "43", "42", "42", "42", "42", "45", "47", "48", "48", "48", "48", "48", "47", "43", "40", "36", "34", "35", "34", "34", "33"]],
  ["2017-01-02", ["33", "33", "33", "32", "31", "32", "32", "33", "34", "37", "38", "39", "39", "39", "38", "39", "38", "38", "39", "37", "37", "38", "38", "38"]],
  ["2017-01-03", ["39", "39", "39", "39", "39", "40", "40", "40", "41", "42", "43", "43", "44", "44", "45", "44", "44", "44", "45", "45", "44", "43", "43", "43"]]
  ]

const noonToNoon = data => {
  const dates = data.map(day => day[0]);
  const hourlyData = data.map(day => day[1]);
  const hourlyDataFlat = [].concat(...hourlyData)

  const arr = [];
  while (hourlyDataFlat.length > 24) {
    arr.push(hourlyDataFlat.splice(12, 24));
  }
  
  let res = {}
  arr.forEach((day,i) => {
    res[dates[i]] = day
  })
  return res
};

const Testing = () => {
  console.log(noonToNoon(data))
  return (
    <h1></h1>
  )
}

export default Testing
