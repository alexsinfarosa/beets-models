import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { format } from "date-fns";

// styled-components
import { Center } from "./styles";

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

    const displayEndDate = format(endDateR, "MM/DD/YYYY");
    const displayStartDate = format(startDateR, "MM/DD/YYYY");
    return (
      <div>
        <Center>
          <h4>{pestR.informalName} Results for {stationR.name}</h4>
        </Center>
        <Center>
          <h5>
            Accumulated Degree Days (
            {pestR.baseTemp}
            °F)
            {" "}
            {displayStartDate}
            {" "}
            through
            {" "}
            {displayEndDate}
            :
            {" "}
            {currentCDD}
            <span style={{ fontWeight: "100", marginLeft: "3px" }}>
              ({missingValue} {missingValue > 1 ? "days" : "day"} missing)
            </span>
          </h5>
        </Center>
      </div>
    );
  }
}
