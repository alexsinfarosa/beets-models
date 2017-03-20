import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import CustomLabel from "./CustomLabel";
// import CustomToolTip from "./CustomToolTip";
import CustomBarLabel from "./CustomBarLabel";

// styles
import "./styles";

@inject("store")
@observer
export default class ResultsTable extends Component {
  render() {
    const { graphData, dailyGraph, setDailyGraph } = this.props.store.app;
    return (
      <div className="graph">
        <ComposedChart
          width={654}
          height={320}
          data={graphData}
          margin={{ top: 20, right: 20, left: -30, bottom: 20 }}
        >
          <XAxis dataKey="dates" tick={<CustomLabel />} />
          <YAxis />
          {/* <Tooltip /> */}
          <Legend verticalAlign="top" height={36} onClick={setDailyGraph} />
          <Area
            type="monotone"
            stackId="1"
            dataKey="high"
            stroke="#FF8B8B"
            fill="#FF8B8B"
          />
          <Area
            type="monotone"
            stackId="2"
            dataKey="caution"
            stroke="#F4D35E"
            fill="#FDFA9F"
          />
          <Area
            type="monotone"
            stackId="3"
            dataKey="low"
            stroke="#8FFD8D"
            fill="#8FFD8D"
          />
          {/* <CartesianGrid stroke="#eee" strokeDasharray="5 5" /> */}
          {dailyGraph
            ? <Bar
                dataKey="daily"
                label={<CustomBarLabel name="daily" />}
                stroke="#808080"
                fill="none"
              />
            : <Bar
                dataKey="a2Day"
                label={<CustomBarLabel name="a2Day" />}
                stroke="#808080"
                fill="none"
              />}
        </ComposedChart>
      </div>
    );
  }
}
