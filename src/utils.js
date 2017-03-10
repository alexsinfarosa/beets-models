import _ from "lodash";

export const states = [
  { postalCode: "AL", lat: 32.6174, lon: -86.6795, zoom: 7, name: "Alabama" },
  {
    postalCode: "CT",
    lat: 41.6220,
    lon: -72.7272,
    zoom: 8,
    name: "Connecticut"
  },
  { postalCode: "DE", lat: 38.9895, lon: -75.5051, zoom: 8, name: "Delaware" },
  { postalCode: "DC", lat: 38.9101, lon: -77.0147, zoom: 8, name: "DC" },
  { postalCode: "IL", lat: 40.0411, lon: -89.1965, zoom: 6, name: "Illinois" },
  { postalCode: "IA", lat: 42.0753, lon: -93.4959, zoom: 6, name: "Iowa" },
  { postalCode: "ME", lat: 45.3702, lon: -69.2438, zoom: 7, name: "Maine" }, // no stations
  { postalCode: "MD", lat: 39.0550, lon: -76.7909, zoom: 7, name: "Maryland" },
  {
    postalCode: "MA",
    lat: 42.2596,
    lon: -71.8083,
    zoom: 7,
    name: "Massachusetts"
  },
  { postalCode: "MI", lat: 44.3461, lon: -85.4114, zoom: 6, name: "Michigan" }, // no stations
  { postalCode: "MN", lat: 46.2810, lon: -94.3046, zoom: 6, name: "Minnesota" },
  { postalCode: "MO", lat: 38.3568, lon: -92.4571, zoom: 6, name: "Missouri" },
  { postalCode: "NE", lat: 41.5392, lon: -99.7968, zoom: 6, name: "Nebraska" },
  {
    postalCode: "NH",
    lat: 43.6805,
    lon: -71.5818,
    zoom: 7,
    name: "New Hampshire"
  },
  {
    postalCode: "NJ",
    lat: 40.1907,
    lon: -74.6733,
    zoom: 7,
    name: "New Jersey"
  },
  { postalCode: "NY", lat: 42.9543, lon: -75.5262, zoom: 6, name: "New York" },
  {
    postalCode: "NC",
    lat: 35.5579,
    lon: -79.3856,
    zoom: 6,
    name: "North Carolina"
  },
  {
    postalCode: "PA",
    lat: 40.8786,
    lon: -77.7985,
    zoom: 7,
    name: "Pennsylvania"
  },
  {
    postalCode: "RI",
    lat: 41.6762,
    lon: -71.5562,
    zoom: 9,
    name: "Rhode Island"
  },
  {
    postalCode: "SC",
    lat: 33.6290,
    lon: -80.9500,
    zoom: 6,
    name: "South Carolina"
  },
  {
    postalCode: "SD",
    lat: 43.9169,
    lon: -100.2282,
    zoom: 6,
    name: "South Dakota"
  },
  { postalCode: "VT", lat: 44.0688, lon: -72.6663, zoom: 7, name: "Vermont" },
  { postalCode: "VA", lat: 37.5229, lon: -78.8531, zoom: 7, name: "Virginia" },
  {
    postalCode: "WV",
    lat: 38.6409,
    lon: -80.6230,
    zoom: 7,
    name: "West Virginia"
  },
  { postalCode: "WI", lat: 44.6243, lon: -89.9941, zoom: 6, name: "Wisconsin" },
  {
    postalCode: "ALL",
    lat: 42.5000,
    lon: -75.7000,
    zoom: 6,
    name: "All States"
  }
];

export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

export const avgTwoStringNumbersWeightedLeft = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + aNum + bNum) / 3).toString();
};

export const avgTwoStringNumbersWeightedRight = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum + bNum) / 3).toString();
};

export const avgWeighted = data => {
  const aNum = parseFloat(data[0]);
  const dNum = parseFloat(data[data.length - 1]);
  const bNum = Math.round((aNum + aNum + dNum) / 3);
  const cNum = Math.round((aNum + dNum + dNum) / 3);
  const results = [aNum, bNum, cNum, dNum];
  return results.map(e => e.toString());
};

// Adjust Temperature parameter and Michigan network id
export const networkTemperatureAdjustment = network => {
  // Handling different temperature parameter for each network
  if (network === "newa" || network === "icao" || network === "njwx") {
    return "23";
  } else if (network === "miwx" || network === "cu_log") {
    return "126";
  }
};

// Handling Michigan state network
export const michiganIdAdjustment = station => {
  if (
    station.state === "MI" &&
    station.network === "miwx" &&
    station.id.slice(0, 3) === "ew_"
  ) {
    // example: ew_ITH
    return station.id.slice(3, 6);
  }
  return station.id;
};

// Flatten the array from ACIS.
// Each element is an array with 2 elements, date(Sring) and an array with 24 values
export const flattenArray = data => {
  const hourlyData = data.map(day => day[1]);
  return [].concat(...hourlyData);
};

// Un-flatten an array
export const unflattenArray = data => {
  const arr = [];
  while (data.length > 0) {
    arr.push(data.splice(0, 24));
  }
  return arr;
};

export const noonToNoon = data => {
  const arr = [];
  while (data.length > 24) {
    arr.push(data.splice(12, 24));
  }
  return arr;
};

// compute degree days
export const calculateDegreeDay = (pest, data) => {
  console.log(`number of days: ${flattenArray(data).length}`);

  const cleanedData = data.map(day => day.filter(e => e !== "M"));
  // const removedMissingDays = cleanedData.filter(day => day.length !== 0)

  const min = cleanedData.map(day => Math.min(...day));
  const max = cleanedData.map(day => Math.max(...day));
  const avg = min.map((val, i) => Math.round((val + max[i]) / 2));
  const base = pest.baseTemp;
  const dd = avg.map(val => val - base > 0 ? val - base : 0);
  console.log(`min: ${min}`);
  console.log(`min: ${min.length}`);
  console.log(`max: ${max}`);
  console.log(`max: ${max.length}`);
  console.log(`avg: ${avg}`);
  console.log(`avg: ${avg.length}`);
  console.log(`dd: ${dd}`);
  console.log(`dd: ${dd.length}`);
  return dd;
};

// compute degree days
// export const calculateDegreeDay = (pest, data) => {
//   const cleanedData = data.map(day => day.filter(e => e !== 'M'))
//
//   let arr = []
//   cleanedData.map(day => {
//     if(day.length > 0) {
//       const min = day.map(day => Math.min(...day))
//       const max = day.map(day => Math.max(...day))
//       const avg = min.map((val, i) => Math.round((val + max[i]) / 2))
//       const base = pest.baseTemp
//       const dd = avg.map(val => val - base > 0 ? val - base : 0)
//       // console.log(`min: ${min}`)
//       // console.log(`max: ${max}`)
//       // console.log(`avg: ${avg}`)
//       // console.log(`dd: ${dd}`)
//       arr.push(dd)
//     }
//   })
//   return arr
// }

export const calculateMissingValues = data => {
  const cleanedData = data.map(day => day.filter(e => e !== "M"));
  const missingDays = cleanedData.filter(day => day.length === 0);
  return missingDays.length;
};

export const calculateCumulativeDegreeDay = degreeDayData => {
  const arr = [];
  degreeDayData.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
  return arr;
};

export const replaceSingleMissingValues = data => {
  return data.map((val, i) => {
    if (i === 0 && val === "M") {
      return data[i + 1];
    } else if (i === data.length - 1 && val === "M") {
      return data[i - 1];
    } else if (val === "M" && data[i - 1] !== "M" && data[i + 1] !== "M") {
      return avgTwoStringNumbers(data[i - 1], data[i + 1]);
    } else {
      return val;
    }
  });
};

export const weightedAverage = data => {
  if (data[2] !== "M") {
    data[0] = data[2];
    data[1] = data[2];
  }
  if (data[data.length - 3] !== "M") {
    data[data.length - 2] = data[data.length - 3];
    data[data.length - 1] = data[data.length - 3];
  }

  let dataConverted = data.map(e => e === "M" ? "M" : "n").join("");
  const pattern = /nMMn/;
  while (pattern.test(dataConverted)) {
    const index = dataConverted.match(pattern).index;
    let match = data.slice(index, index + 4);
    const matchString = avgWeighted(match).join("");
    dataConverted = dataConverted.replace(pattern, matchString);
  }
  return dataConverted.split("").map((e, i) => e === "n" ? data[i] : e);
};

export const replaceConsecutiveMissingValues = (
  sisterStation,
  currentStation
) => {
  const arr = [];
  currentStation.forEach((e, i) => {
    if (e === "M" && sisterStation[i] !== "M") {
      arr.push(sisterStation[i]);
    } else {
      arr.push(e);
    }
  });
  return arr;
};

export const matchIconsToStations = (stations, state) => {
  const arr = [];
  const newa = "http://newa.nrcc.cornell.edu/gifs/newa_small.png";
  const newaGray = "http://newa.nrcc.cornell.edu/gifs/newa_smallGray.png";
  const airport = "http://newa.nrcc.cornell.edu/gifs/airport.png";
  const airportGray = "http://newa.nrcc.cornell.edu/gifs/airportGray.png";
  const culog = "http://newa.nrcc.cornell.edu/gifs/culog.png";
  const culogGray = "http://newa.nrcc.cornell.edu/gifs/culogGray.png";

  stations.forEach(station => {
    if (
      station.network === "newa" ||
      station.network === "njwx" ||
      station.network === "miwx" ||
      (station.network === "cu_log" && station.state !== "NY")
    ) {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = newa)
        : (newObj["icon"] = newaGray);
      arr.push(newObj);
    } else if (station.network === "cu_log") {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = culog)
        : (newObj["icon"] = culogGray);
      newObj["icon"] = culog;
      arr.push(newObj);
    } else if (station.network === "icao") {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = airport)
        : (newObj["icon"] = airportGray);
      arr.push(newObj);
    }
  });
  return arr;
};

// If there are stages chose the one where the current dd value is between ddlo and ddhi
// export const calculateStageToDisplay = (getCumulativeDegreeDay, pest) => {
//   if (getCumulativeDegreeDay.length > 0 && pest.preBiofix.length > 0) {
//     const currentDegreeDayValue = getCumulativeDegreeDay[getCumulativeDegreeDay.length - 6]
//     const selectedStage = pest.preBiofix.filter(stage => (currentDegreeDayValue > stage.ddlo && currentDegreeDayValue < stage.ddhi))[0]
//     return selectedStage
//   }
//   return {}
// }
