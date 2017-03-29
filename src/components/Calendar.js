import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Flatpickr from "react-flatpickr";
import subYears from "date-fns/sub_years";
import getYear from "date-fns/get_year";

// styles for the calendar
import "./calendar.css";

// styled-components
import { Selector } from "./styles";

@inject("store")
@observer
class Calendar extends Component {
  render() {
    const { endDate } = this.props.store.app;
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
            defaultDate: endDate ? endDate : new Date(),
            minDate: `${getYear(subYears(new Date(), 1))}/04/23`
          }}
          onChange={d => this.props.store.app.setEndDate(d)}
        />
      </Selector>
    );
  }
}

export default Calendar;
