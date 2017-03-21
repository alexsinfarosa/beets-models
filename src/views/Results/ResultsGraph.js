import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Text,
  Tooltip,
  Legend
} from "recharts";
import CustomLabel from "./CustomLabel";
// import CustomToolTip from "./CustomToolTip";
import CustomBar from "./CustomBar";

// styles
import "./styles";

@inject("store")
@observer
export default class ResultsTable extends Component {
  render() {
    const { graphData } = this.props.store.app;

    const renderLegend = props => {
      const { payload } = props;
      console.log(payload[0]);
      console.log(payload[0]);
    };

    return (
      <div>
        <Text style={{ display: "block", marginTop: "20px", fontSize: "16px" }}>
          2-Day Infection Values
        </Text>
        <ComposedChart
          width={654}
          height={320}
          data={graphData}
          margin={{ top: 0, right: 20, left: -30, bottom: 5 }}
        >
          <XAxis dataKey="dates" tick={<CustomLabel />} />
          <YAxis />
          <Tooltip
            wrapperStyle={{ background: "#F4F0EC" }}
            content={renderLegend}
          />
          <Legend
            wrapperStyle={{ paddingTop: "30px" }}
            verticalAlign="bottom"
            iconSize={16}
            iconType="rect"
            payload={[
              { value: "Unfavorable", type: "rect", color: "#A3FDA1" },
              { value: "Marginal", type: "rect", color: "#FDFAB0" },
              { value: "Favorable", type: "rect", color: "#FFA0A0" }
            ]}
          />
          <Area
            name="Favorable"
            type="monotone"
            stackId="1"
            dataKey="favorable"
            stroke="#FFA0A0"
            fill="#FFA0A0"
          />
          <Area
            name="Marginal"
            type="monotone"
            stackId="2"
            dataKey="marginal"
            stroke="#FDFAB0"
            fill="#FDFAB0"
          />
          <Area
            name="Unfavorable"
            type="monotone"
            stackId="3"
            dataKey="unfavorable"
            stroke="#A3FDA1"
            fill="#A3FDA1"
          />
          <Bar name="2-Day" dataKey="a2Day" shape={<CustomBar />} />

        </ComposedChart>
      </div>
    );
  }
}
