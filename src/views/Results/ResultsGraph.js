import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import CustomLabel from "./CustomLabel";

// styles
import "./styles";

@inject("store")
@observer
export default class ResultsTable extends Component {
  @observable daily = true;
  render() {
    const { graphData } = this.props.store.app;
    return (
      <div className="graph">
        <BarChart width={614} height={260} data={graphData}>
          <XAxis dataKey="dates" tick={<CustomLabel />} />
          <YAxis />
          <Tooltip />
          <Legend
            verticalAlign="top"
            height={36}
            onClick={() => this.daily = !this.daily}
          />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          {this.daily
            ? <Bar dataKey="daily" fill="#8884d8" />
            : <Bar dataKey="a2Day" fill="#82ca9d" />}
        </BarChart>
      </div>
    );
  }
}
