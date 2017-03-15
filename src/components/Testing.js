import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import _ from "lodash";
// import { noonToNoon } from "../utils";
import { table } from "./MindlessTable";

@inject("store")
@observer
class Testing extends Component {

  dicv = (key, t) => {
    const x = table.filter(e => e[key])[0][key];
    const y = x.filter(e => Object.keys(e)[0] === t)[0]
    return y[t]
  }

  render() {
    // const x = this.dicv('3','59')
    // console.log(x);

    return <div />;
  }
}

export default Testing;
