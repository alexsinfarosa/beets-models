import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { subYears, getYear } from "date-fns";

import "flatpickr/dist/themes/material_orange.css";
import Flatpickr from "react-flatpickr";
import "./Calendar.css";

// styled-components
import { Selector } from "./styles";

@inject("store")
@observer
class Calendar extends Component {
  render() {
    return (
      <Selector>
        <label>Accumulation End Date:</label>
        <Flatpickr
          options={{
            enableTime: false,
            altInput: true,
            altFormat: "F j, Y",
            inline: false, // show the calendar inline
            altInputClass: "input-calender",
            defaultDate: "today",
            minDate: `${getYear(subYears(new Date(), 1))}/06/15`
          }}
          onChange={d => this.props.store.app.setEndDate(d)}
        />
      </Selector>
    );
  }
}

export default Calendar;
