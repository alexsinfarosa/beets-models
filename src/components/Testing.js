import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { when, toJS } from "mobx";
import _ from "lodash";
import { noonToNoon, accumulationInfectionValues } from "../utils";
import { table } from "./MindlessTable";

@inject("store")
@observer
class Testing extends Component {
  DIV = () => {
    const { hums } = this.props.store.app;

    const hr = hums.map(e => e.filter(a => a > 94).length);
    // console.log(hr);
  };

  // hours = (key, t) => {
  //   const x = table.filter(e => e[key])[0][key];
  //   const y = x.map(e => e[t])
  //   return y.filter(d => d !== undefined)[0]
  // }

  hours = (key, t) => {
    const x = table.filter(e => e[key])[0][key];
    const y = x.filter(e => Object.keys(e)[0] === t)[0]
    return y[t]
  }

  render() {
    const x = this.hours('3','59')
    console.log(x);
    return <div />;
  }
}

export default Testing;
