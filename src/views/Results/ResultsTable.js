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
    this.setIsGraphDisplayed(!this.isGraphDisplayed);
  };

  render() {
    const {
      dates,
      stationR,
      endDateR,
      hums
    } = this.props.store.app;

    const displayMonths = dates.map(date => {
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
      HeaderTable = (
        <th className="after" colSpan="5">
          {" "}Ensuing 5 Days
        </th>
      );
    }

    const daily = hums.map((e, i) => {
      const div = e.filter(d => d > 94 && d !== "M").length;
      return <td key={i}>{div}</td>;
    });
    console.log(daily);
    // const hr = hums.map((e, i) => <td key={i} {e.filter(a => a > 94).length} </td>);

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
              {_.takeRight(displayMonths, 8)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Daily Infection Value</th>
              {_.takeRight(daily, 8)}
            </tr>
            <tr>
              <th>2-Day Accum Infection Values</th>
              {/* {_.takeRight(daily, 8)} */}
            </tr>
            <tr>
              <th>Daily Infection Risk</th>
              {/* {_.takeRight(daily, 8)} */}
            </tr>
            <tr>
              <th>14-Day Accum Infection Values</th>
              {/* {_.takeRight(hr, 8)} */}
            </tr>
            <tr>
              <th>21-Day Accum Infection Values</th>
              {/* {_.takeRight(displayCumulativeDegreeDay, 8)} */}
            </tr>
            <tr>
              <th>Season Total Infection Values</th>
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
