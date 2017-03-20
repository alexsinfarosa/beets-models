import React, { Component } from "react";

export default class CustomToolTip extends Component {
  getIntroOfPage(label) {
    if (label === "Page A") {
      return "Page A is about men's clothing";
    } else if (label === "Page B") {
      return "Page B is about women's dress";
    }
  }

  render() {
    const { active } = this.props;
    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{this.getIntroOfPage(label)}</p>
          <p className="desc">Anything you want can be displayed here.</p>
        </div>
      );
    }

    return null;
  }
}
