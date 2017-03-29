import { table } from "./table";

// Returns an array of objects. Each object is a station with the following
// properties: TO DO...
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

// Returns the average of two numbers.
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

// Handling Temperature parameter and Michigan network id adjustment
export const networkTemperatureAdjustment = network => {
  // Handling different temperature parameter for each network
  if (network === "newa" || network === "icao" || network === "njwx") {
    return "23";
  } else if (network === "miwx" || network === "cu_log") {
    return "126";
  }
};

// Handling Relative Humidity Adjustment
export const networkHumidityAdjustment = network =>
  network === "miwx" ? "143" : "24";

// Handling Michigan state network adjustment
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

// It replaces non consecutive values in data with the average
// of the left and the right values
export const replaceNonConsecutiveMissingValues = data => {
  return data.map(day => {
    return day.map(param => {
      if (Array.isArray(param)) {
        return param.map((e, i) => {
          if (i === 0 && e === "M") {
            return param[i + 1];
          } else if (i === param.length - 1 && e === "M") {
            return param[i - 1];
          } else if (
            e === "M" && param[i - 1] !== "M" && param[i + 1] !== "M"
          ) {
            return avgTwoStringNumbers(param[i - 1], param[i + 1]);
          } else {
            return e;
          }
        });
      }
      return param;
    });
  });
};

// Returns acis with replaced consecutive values
export const replaceConsecutiveMissingValues = (sister, acis) => {
  return acis.map((day, d) => {
    return day.map((param, p) => {
      if (Array.isArray(param)) {
        return param.map((e, i) => {
          if (e === "M") {
            return sister[d][p][i];
          } else {
            return e;
          }
        });
      }
      return param;
    });
  });
};

// Returns true if the there are Missing values in the sub arrays (TP, RH, LW, PT)
export const containsMissingValues = data => {
  const TPandRH = data
    .map(day => day[1].filter(e => e === "M").length)
    .reduce((acc, val) => acc + val, 0);

  return TPandRH > 0 ? true : false;
};

// Returns an array similar to ACIS with the rh sub array containing new values.
// The new values are calculated according to the equation below.
export const RHAdjustment = data => {
  return data.map(day => {
    return day.map((param, i) => {
      // Modify only RH array
      if (i === 2) {
        return param.map(e => {
          if (e !== "M") {
            return Math.round(
              parseFloat(e) / (0.0047 * parseFloat(e) + 0.53)
            ).toString();
          } else {
            return e;
          }
        });
      }
      return param;
    });
  });
};

// Returns array of Accumulation Infection Values
// export const accumulationInfectionValues = data => {
//   const arr = [];
//   data.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
//   return arr;
// };

// Returns an array with cumulative Daily Infection Critical Values
export const cumulativeDICV = dicv => {
  const arr = [];
  dicv.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
  return arr;
};

// Returns array containing only temperature values where rh was above 85.
export const above85 = data => {
  let results = [];

  for (const day of data) {
    let currentDay = [day[0], [], []];

    for (let [i, e] of day[2].entries()) {
      if (parseFloat(e) > 95) {
        currentDay[1].push(day[1][i]);
        currentDay[2].push(e);
      }
    }
    results.push(currentDay);
  }
  return results;
};

// Returns average
export const average = data => {
  if (data.length === 0) {
    return 0;
  }
  let results = data.map(e => parseFloat(e));
  return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
};

// This function will shift data from (0, 23) to (12, 24)
export const noonToNoon = data => {
  let results = [];

  // get all dates
  const dates = data.map(day => day[0]);

  // shifting Temperature array
  const TP = data.map(day => day[1]);
  const TPFlat = [].concat(...TP);
  let TPShifted = [];
  while (TPFlat.length > 24) {
    TPShifted.push(TPFlat.splice(12, 24));
  }

  // shifting relative humidity array
  let RH = data.map(day => day[2]);
  const RHFlat = [].concat(...RH);
  let RHShifted = [];
  while (RHFlat.length > 24) {
    RHShifted.push(RHFlat.splice(12, 24));
  }

  // shifting leaf wetness array
  const LW = data.map(day => day[3]);
  const LWFlat = [].concat(...LW);
  let LWShifted = [];
  while (LWFlat.length > 24) {
    LWShifted.push(LWFlat.splice(12, 24));
  }

  // shifting precipitation array
  const PT = data.map(day => day[4]);
  const PTFlat = [].concat(...PT);
  let PTShifted = [];
  while (PTFlat.length > 24) {
    PTShifted.push(PTFlat.splice(12, 24));
  }

  for (const [i, el] of dates.entries()) {
    results[i] = [el, TPShifted[i], RHShifted[i], LWShifted[i], PTShifted[i]];
  }

  return results;
};

// Determine Daily Infection Condition Values (DICV) from the table
export const lookUpToTable = (table, hrsRH, avgT) => {
  const temps = table.filter(e => e[hrsRH])[0][hrsRH];
  const hums = temps.filter(e => Object.keys(e)[0] === avgT)[0];
  return hums[avgT];
};

// Returns an array of objects. Current application model
export const currentModel = (station, data) => {
  // shift the data to (1,24)
  let results = noonToNoon(data);
  results = results.slice(0, -1);

  // If station is 'icao' adjust RH values
  if (station.network === "icao") {
    results = RHAdjustment(results);
  }

  // filter RH above 85
  results = above85(results);

  // Build an array of objects with what you need...!
  let arr = [];
  for (const day of results) {
    const hrsRH = day[2].length;
    const avgT = average(day[1]);
    let DICV;
    if (avgT > 58 && avgT < 95) {
      DICV = table[hrsRH.toString()][avgT.toString()];
    } else {
      DICV = 0;
    }
    arr.push({
      date: day[0],
      temp: day[1],
      rh: day[2],
      hrsRH: hrsRH,
      avgT: avgT,
      dicv: DICV
    });
  }
  console.log(arr);
  return arr;
};

// Returns styled console.logs
export const logData = data => {
  for (const day of data) {
    const M = day
      .filter(d => Array.isArray(d))
      .map(e => e.filter(d => d === "M").length);

    console.log(`%c${day[0]}`, `color: red; font-size: 12px`);
    console.log(
      `TP -> %c${M[0]} %c${day[1]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #FFA8A8`
    );
    console.log(
      `RH -> %c${M[1]} %c${day[2]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #D8D8D8`
    );
  }
};
