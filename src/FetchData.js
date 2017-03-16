import axios from "axios";
import { format, addDays } from "date-fns";
// import _ from "lodash";

// utility functions
import {
  networkHumidityAdjustment,
  networkTemperatureAdjustment,
  michiganIdAdjustment
} from "./utils";

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
