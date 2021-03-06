import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import ResultsGraph from "./ResultsGraph";
import takeRight from "lodash/takeRight";
import format from "date-fns/format";
import isBefore from "date-fns/is_before";
import subDays from "date-fns/sub_days";

// styles
import "./results.css";

// styled-components
import { Low, Caution, High } from "./styles";

@inject("store")
@observer
export default class ResultsTable extends Component {
  render() {
    const {
      dates,
      stationR,
      endDateR,
      DICV,
      A2Day,
      A14Day,
      A21Day,
      season,
      currentYear,
      startDateYear,
      isGraphDisplayed,
      setIsGraphDisplayed
    } = this.props.store.app;

    const months = dates.map(date => {
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
    if (currentYear === startDateYear) {
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

    const daily = DICV.map((e, i) => <td key={i}>{e}</td>);

    const displayA2Day = A2Day.map((e, i) => {
      if (e >= 0 && e <= 3) {
        return <Low key={i}>{e}</Low>;
      } else if (e >= 4 && e <= 6) {
        return <Caution key={i}>{e}</Caution>;
      }
      return <High key={i}>{e}</High>;
    });

    const a2DayInfectionRisk = A2Day.map((e, i) => {
      if (e >= 0 && e <= 3) {
        return <Low key={i}><small>Low</small></Low>;
      } else if (e >= 4 && e <= 6) {
        return <Caution key={i}><small>Moderate</small></Caution>;
      }
      return <High key={i}><small>High</small></High>;
    });

    const displayA14Day = A14Day.map((e, i) => <td key={i}>{e}</td>);
    const displayA21Day = A21Day.map((e, i) => <td key={i}>{e}</td>);
    const displaySeason = season.map((e, i) => <td key={i}>{e}</td>);

    return (
      <table>
        <thead>
          <tr>
            <th rowSpan="2" />
            <th className="before">Past</th>
            <th className="before">Past</th>
            <th className="before">Current</th>
            {HeaderTable}
          </tr>
          <tr>
            {/* <th /> */}
            {takeRight(months, 8)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th><small>Daily <br />Infection Values</small></th>
            {takeRight(daily, 8)}
          </tr>
          <tr>
            <th><small>2-Day <br /> Total Infection Values</small></th>
            {takeRight(displayA2Day, 8)}
          </tr>
          <tr>
            <th><small>2-Day <br /> Infection Risk</small></th>
            {takeRight(a2DayInfectionRisk, 8)}
          </tr>
          <tr>
            <th><small>14-Day <br />Accum. Infection Values</small></th>
            {takeRight(displayA14Day, 8)}
          </tr>
          <tr>
            <th><small>21-Day <br /> Accum. Infection Values</small></th>
            {takeRight(displayA21Day, 8)}
          </tr>
          <tr>
            <th><small>Season <br /> Total Infection Values</small></th>
            {takeRight(displaySeason, 8)}
          </tr>
          <tr>
            <td colSpan="9" className="has-text-centered graph">
              <a className="graph-link" onClick={setIsGraphDisplayed}>
                {isGraphDisplayed ? "Hide" : "Show"}
                {" "}
                Infection Value Graph
              </a>

              {isGraphDisplayed && <ResultsGraph />}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
