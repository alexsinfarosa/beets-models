import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";
import ResultsGraph from "./ResultsGraph";
import _ from "lodash";
import { format, isBefore, subDays } from "date-fns";

// styles
import "./results.css";

@inject("store")
@observer
export default class ResultsTable extends Component {
  @observable isGraphDisplayed = false;
  @action setIsGraphDisplayed = d => this.isGraphDisplayed = d;
  @observable currentYear = format(new Date(), "YYYY");

  handleGraphClick = () => {
    this.setIsGraphDisplayed(true);
  };

  render() {
    const {
      pestR,
      // cumulativeDegreeDays,
      allDates,
      // degreeDays,
      stationR,
      endDateR
    } = this.props.store.app;

    const displayMonths = allDates.map(date => {
      if (isBefore(subDays(date, 1), endDateR)) {
        return (
          <th className="months before" key={date}>{format(date, "MMM D")}</th>
        );
      } else {
        return (
          <th className="months after" key={date}>{format(date, "MMM D")}</th>
        );
      }
    });

    let HeaderTable = null;
    if (this.currentYear === format(endDateR, "YYYY")) {
      HeaderTable = (
        <th className="after" colSpan="5">
          {" "}5 Days forecasts
          <a
            target="_blank"
            href={
              `http://forecast.weather.gov/MapClick.php?textField1=${stationR.lat}&textField2=${stationR.lon}`
            }
            className="forecast-details"
          >
            Forecast Details
          </a>
        </th>
      );
    } else {
      HeaderTable = <th className="after" colSpan="5"> Ensuing 5 Days</th>;
    }

    // const displayDegreeDay = degreeDays.map((dd, i) => <td key={i}>{dd}</td>);
    // const displayCumulativeDegreeDay = cumulativeDegreeDays.map((cdd, i) => (
    //   <td key={i}>{cdd}</td>
    // ));

    return (
      // <div>
      (
        <table>
          <thead>
            <tr>
              <th rowSpan="1" />
              <th className="before">Past</th>
              <th className="before">Past</th>
              <th className="before">Current</th>
              {HeaderTable}
            </tr>
            <tr>
              <th>Date</th>
              {/* {_.takeRight(displayMonths, 8)} */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Daily Degree Days <br /> (Base {pestR.baseTemp}BE)</th>
              {/* {_.takeRight(displayDegreeDay, 8)} */}
            </tr>
            <tr>
              <th>Accumulation since <br /> January 1st</th>
              {/* {_.takeRight(displayCumulativeDegreeDay, 8)} */}
            </tr>
            <tr>
              <td colSpan="9" className="has-text-centered graph">
                <a className="graph-link" onClick={this.handleGraphClick}>
                  {this.isGraphDisplayed ? "Hide" : "Show"}
                  {" "}
                  Accumulated Degree-Days Graph
                </a>

                {this.isGraphDisplayed && <ResultsGraph />}
              </td>
            </tr>
          </tbody>
        </table>
      )
      // </div>
    );
  }
}
