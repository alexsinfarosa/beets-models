import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import _ from "lodash";
// import { noonToNoon } from "../utils";
// import { table } from "../../src/table";
// import { acis } from "../dummyData";

@inject("store")
@observer
class Testing extends Component {
  // RHAdjustment = data => {
  //   return data.map(day => {
  //     return day.map((param, i) => {
  //       // Modify only RH array
  //       if (i === 2) {
  //         return param.map(e => {
  //           if (e !== "M") {
  //             return Math.round(
  //               parseFloat(e) / (0.0047 * parseFloat(e) + 0.53)
  //             ).toString();
  //           } else {
  //             return e;
  //           }
  //         });
  //       }
  //       return param;
  //     });
  //   });
  // };

  // above85 = data => {
  //   let results = [];
  //
  //   for (const day of data) {
  //     let currentDay = [day[0], [], []];
  //
  //     for (let [i, e] of day[2].entries()) {
  //       if (parseFloat(e) > 95) {
  //         currentDay[1].push(day[1][i]);
  //         currentDay[2].push(e);
  //       }
  //     }
  //     results.push(currentDay);
  //   }
  //   return results;
  // };

  // average = data => {
  //   if (data.length === 0) {
  //     return 0;
  //   }
  //   let results = data.map(e => parseFloat(e));
  //   return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
  // };

  render() {
    // console.log(this.average([]));
    // console.log(acis);
    // console.log(this.above85(acis));
    // console.log(table["1"]["63"]);
    return <div />;
  }
}

export default Testing;
