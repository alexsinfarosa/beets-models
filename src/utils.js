// Returns the average of two numbers.
// Inputs are of type String
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

// It replaces non consecutive values in data with the average
// of the left and the right values
export const replaceNonConsecutiveMissingValues = data => {
  return data.map(day => {
    return day.map(param => {
      if (Array.isArray(param)) {
        return param.map((val, i) => {
          if (i === 0 && val === "M") {
            return param[i + 1];
          } else if (i === param.length - 1 && val === "M") {
            return param[i - 1];
          } else if (
            val === "M" && param[i - 1] !== "M" && param[i + 1] !== "M"
          ) {
            return avgTwoStringNumbers(param[i - 1], param[i + 1]);
          } else {
            return val;
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

// Returns true if the temperature array in data has at least one M value
export const containsMissingValues = data => {
  const numOfMissingValues = data.map(day => day[1].find(e => e === "M"));
  if (numOfMissingValues.find(e => e === "M") === "M") {
    return true;
  }
  return false;
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

// Returns an array similar to ACIS with the rh sub array containing new values.
// The new values are calculated according to the equation below.
export const RHAdjustment = data => {
  let results = [];

  data.forEach(day => {
    let currentDay = [day[0], day[1], []];

    day[2].map((e, i) => {
      let rh;
      if (e !== "M") {
        rh = Math.round(parseFloat(e) / (0.0047 * parseFloat(e) + 0.53));
      } else {
        rh = e;
      }
      currentDay[2].push(rh.toString());
    });
    results.push(currentDay);
  });

  return results;
};

// Handling Relative Humidity Adjustment
export const networkHumidityAdjustment = network =>
  network === "miwx" ? "143" : "24";

// Returns and array of Accumulation Infection Values
export const accumulationInfectionValues = data => {
  const arr = [];
  data.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
  return arr;
};

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

// Returns an array similar to ACIS. The rh array contains only values
// above 95. The temp array contains only temperature values where rh was
// above 95.
export const above95Only = data => {
  let results = [];

  data.forEach(day => {
    let currentDay = [day[0], [], []];

    day[2].map((e, i) => {
      if (parseFloat(e) > 95) {
        currentDay[1].push(day[1][i]);
        currentDay[2].push(e);
      }
    });
    if (currentDay[2].length > 0) {
      results.push(currentDay);
    }
  });

  return results;
};

// This function will shift data from (1, 24) to (12, 24)
// Returns and array of objects where eache object has the following
// properties:
// {date: '2016-01-01', hr: ['34','44'...], temp: ['67','45'...], hrsRH: 3, avgT: 67}
export const noonToNoon = (station, data) => {
  // get all dates
  const dates = data.map(day => day[0]);

  // relative humidity
  const hum = data.map(day => day[2]);
  const humFlat = [].concat(...hum);
  let humFlatNum = humFlat.map(e => parseInt(e, 10));
  // console.log(`${humFlatNum}`);
  if (station.network === "icao") {
    humFlatNum = humFlatNum.map(e => {
      if (e === "M") {
        return "M";
      } else {
        return Math.round(e / (0.0047 * e + 0.53));
      }
    });
  }
  // console.log(`${humFlatNum}`);

  // Filter relative humidity values above the chosen percentage
  // If there are NaN values it replaces with 0
  const humFlatNumAbove95RH = humFlatNum.map(e => e > 95 ? e : 0);

  // unflatten RH array
  const humNumAbove95RH = [];
  const humFlatNumAbove95RHCopy = [...humFlatNumAbove95RH];
  while (humFlatNumAbove95RHCopy.length > 24) {
    humNumAbove95RH.push(humFlatNumAbove95RHCopy.splice(12, 24));
  }

  // determine the amount of hours with a relative humidity above the chosen percentage
  const RHCount = humNumAbove95RH.map(day => day.filter(e => e > 0).length);

  // hourly temperatures
  const temp = data.map(day => day[1]);
  const tempFlat = [].concat(...temp);
  const tempFlatNum = tempFlat.map(e => parseInt(e, 10));

  // filter hourly temperature vlues above the chosen percentage
  const tempFlatNumAbove95RH = humFlatNumAbove95RH.map(
    (e, i) => e === 0 ? 0 : tempFlatNum[i]
  );

  // unflatten the temperature array
  const tempNumAbove95RH = [];
  while (tempFlatNumAbove95RH.length > 24) {
    tempNumAbove95RH.push(tempFlatNumAbove95RH.splice(12, 24));
  }

  // calculating average temperature
  const avgT = tempNumAbove95RH.map(day => {
    const aboveVal = day.filter(e => e > 0);
    if (aboveVal.length > 0) {
      return Math.round(
        aboveVal.reduce((acc, val) => acc + val, 0) / aboveVal.length
      );
    }
    return 0;
  });

  // relative humidity (HR) array
  const hArr = [];
  while (humFlatNum.length > 24) {
    hArr.push(humFlatNum.splice(12, 24));
  }

  // temperature array
  const tArr = [];
  while (tempFlatNum.length > 24) {
    tArr.push(tempFlatNum.splice(12, 24));
  }

  let res = [];
  tArr.forEach((temps, i) => {
    res.push({
      date: dates[i],
      rh: hArr[i],
      temp: temps,
      hrsRH: RHCount[i],
      avgT: avgT[i]
    });
  });
  return res;
};

// Determine Daily Infection Condition Values (DICV) from the table
export const lookUpToTable = (table, hrsRH, avgT) => {
  const temps = table.filter(e => e[hrsRH])[0][hrsRH];
  const hums = temps.filter(e => Object.keys(e)[0] === avgT)[0];
  return hums[avgT];
};

// Returns an array with cumulative Daily Infection Critical Values
export const cumulativeDICV = dicv => {
  const arr = [];
  dicv.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
  return arr;
};

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
