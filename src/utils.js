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

// Adjust Temperature parameter and Michigan network id
export const networkTemperatureAdjustment = network => {
  // Handling different temperature parameter for each network
  if (network === "newa" || network === "icao" || network === "njwx") {
    return "23";
  } else if (network === "miwx" || network === "cu_log") {
    return "126";
  }
};

export const networkHumidityAdjustment = network =>
  network === "miwx" ? "143" : "24";


export const accumulationInfectionValues = data => {
  const arr = []
  data.reduce((prev, curr, i) => arr[i] = prev + curr, 0)
  return arr
}


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

export const noonToNoon = data => {
  const dates = data.map(day => day[0]);

  const temp = data.map(day => day[1]);
  const tempFlat = [].concat(...temp);

  const hum = data.map(day => day[2]);
  const humFlat = [].concat(...hum);

  const t = [];
  while (tempFlat.length > 24) {
    t.push(tempFlat.splice(12, 24));
  }

  const h = [];
  while (humFlat.length > 24) {
    h.push(humFlat.splice(12, 24));
  }

  let res = [];
  t.forEach((t, i) => {
    res.push({ date: dates[i], hum: h[i], temp: t });
  });
  return res;
};

export const DIV = (data) => {
  return data
}

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
