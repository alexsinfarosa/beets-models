import React, { Component } from "react";

export default class CustomBar extends Component {
  render() {
    const { x, y, payload, height, width } = this.props;

    if (payload.a2Day < 6) {
      return <rect x={x} y={y} width={width} height={height} fill="#7F9B6B" />;
    } else if (payload.a2Day === 6) {
      return <rect x={x} y={y} width={width} height={height} fill="#E6CFA5" />;
    }
    return <rect x={x} y={y} width={width} height={height} fill="#CD9E9C" />;
  }
}
