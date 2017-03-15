import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import _ from "lodash";
// import { noonToNoon } from "../utils";
// import { table } from "../views/Results/table";

@inject("store")
@observer
class Testing extends Component {

  render() {
    return <div />;
  }
}

export default Testing;
