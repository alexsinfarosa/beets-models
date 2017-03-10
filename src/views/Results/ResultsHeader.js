import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { format } from "date-fns";

// styled-components
import { CenterText } from "./styles";

@inject("store")
@observer
export default class ResultsHeader extends Component {
  render() {
    const {
      pestR,
      stationR,
      startDateR,
      endDateR,
      currentCDD,
      missingValue
    } = this.props.store.app;

    return (
      <div>
        <CenterText>
          <h4>{pestR.informalName} Results for {stationR.name}</h4>
        </CenterText>
        <CenterText>
          <h5>
            Accumulated Degree Days (
            {pestR.baseTemp}
            °F)
            {" "}
            {format(startDateR, "MM/DD/YYYY")}
            {" "}
            through
            {" "}
            {format(endDateR, "MM/DD/YYYY")}
            :
            {" "}
            {currentCDD}
            <span style={{ fontWeight: "100", marginLeft: "3px" }}>
              ({missingValue} {missingValue > 1 ? "days" : "day"} missing)
            </span>
          </h5>
        </CenterText>
      </div>
    );
  }
}
