import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import CustomLabel from './CustomLabel';

// styles
import './styles'

@inject('store')
@observer
export default class ResultsTable extends Component {

  render() {
    const {cumulativeDegreeDayDataGraph} = this.props.store.app;
    return (
      <div className="graph">
        <LineChart
          width={614}
          height={260}
          data={cumulativeDegreeDayDataGraph}
        >
          <XAxis dataKey="Date" tick={<CustomLabel />} />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="Accumulated Degree-Days"
            dot={false}
            stroke="black"
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </div>
    );
  }
}
