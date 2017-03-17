import axios from "axios";
import { format, addDays } from "date-fns";
// import _ from "lodash";

// utility functions
import {
  networkHumidityAdjustment,
  networkTemperatureAdjustment,
  michiganIdAdjustment
} from "./utils";

// Fetch acis data ----------------------------------------------------------------
export function fetchACISData(station, startDate, endDate) {
  const params = {
    sid: `${michiganIdAdjustment(station)} ${station.network}`,
    sdate: startDate,
    // Plus 6 days because we account for the noonToNoon function
    edate: format(addDays(endDate, 6), "YYYY-MM-DD"),
    elems: [
      networkTemperatureAdjustment(station.network),
      networkHumidityAdjustment(station.network)
    ]
  };

  console.log(params);

  return axios
    .post("http://data.test.rcc-acis.org/StnData", params)
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
}

// Get sister station Id and network -------------------------------------------
export function getSisterStationIdAndNetwork(station) {
  return axios(
    `http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`
  )
    .then(res => {
      return res.data.temp;
    })
    .catch(err => {
      console.log(err);
    });
}

// Fetch sister station data -----------------------------------------------------
export function fetchSisterStationData(idAndNetwork, startDate, endDate) {
  const [id, network] = idAndNetwork.split(" ");

  const params = {
    sid: `${id} ${network}`,
    sdate: startDate,
    edate: format(addDays(endDate, 6), "YYYY-MM-DD"),
    elems: [
      networkTemperatureAdjustment(network),
      networkHumidityAdjustment(network)
    ]
  };

  console.log(params);

  return axios
    .post("http://data.test.rcc-acis.org/StnData", params)
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
}

// Fetch forecast temperature --------------------------------------------------------
export function fetchForecastTemps(station, startDate, endDate) {
  console.log(
    `http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
  );
  return axios
    .get(
      `http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
    )
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
}

// Fetch forecast relative humidity ----------------------------------------------------
export function fetchForecastRH(station, startDate, endDate) {
  return axios
    .get(
      `http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/rhum/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
    )
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
}

// Fetch forecast data --------------------------------------------------------
export function fetchForecastData(station, startDate, endDate) {
  return axios
    .all([
      fetchForecastTemps(station, startDate, endDate),
      fetchForecastRH(station, startDate, endDate)
    ])
    .then(res => {
      // console.log(res);
      const datesAndTemps = res[0];
      const rhum = res[1].map(day => day[1]);
      let data = datesAndTemps.map((day, i) => {
        return day.concat([rhum[i]]);
      });
      return data;
    })
    .catch(err => {
      console.log(err);
    });
}
