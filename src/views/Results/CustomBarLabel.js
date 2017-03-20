import React, { Component } from "react";

export default class CustomBarLabel extends Component {
  render() {
    const { x, y, stroke, payload, height, name, width } = this.props;
    console.log(this.props);
    return (
      <svg>
        <text
          x={x}
          y={height !== 0 ? y + 16 : null}
          fontSize={`${10 + 0.1 * width}px`}
          fill="#5E5E5E"
          textAnchor="middle"
        >
          {payload[name]}
        </text>
      </svg>
    );
  }
}
