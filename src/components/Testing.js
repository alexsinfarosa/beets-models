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

  hours = (key, t) => {
    const avgT = table.filter(e => e[key])[0][key];
    console.log(avgT);
    console.log(avgT.filter(e => e[t])[0][t]);
  };

  render() {
    console.log(this.hours(3, 59));
    // console.log(obj);
    return <div />;
  }
}

export default Testing;
