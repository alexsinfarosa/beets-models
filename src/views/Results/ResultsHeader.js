import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";

// styled-components
import { CenterText } from "./styles";

@inject("store")
@observer
export default class ResultsHeader extends Component {
  render() {
    const {
      diseaseR,
      stationR,
      startDateR,
      endDateR
    } = this.props.store.app;

    return (
      <div>
        <CenterText>
          <h4 style={{ letterSpacing: "1px" }}>
            {diseaseR}
            {" "}
            Predictions for
            {" "}
            {stationR.name}
          </h4>
        </CenterText>
        <CenterText>
          <h5 style={{ letterSpacing: "0px" }}>
            {format(startDateR, "MMMM Do YYYY")}
            {" "}
            <span style={{ fontWeight: "100" }}>through</span>
            {" "}
            {format(endDateR, "MMMM Do YYYY")}
          </h5>
        </CenterText>
      </div>
    );
  }
}
