import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";

// styled-components
import { Select, Selector } from "./styles";

@inject("store")
@observer
class Station extends Component {
  @observable isDisabled = false;
  @action setIsDisabled = d => this.isDisabled = d;

  handleChange = e => {
    this.setIsDisabled(true);
    this.props.store.app.setStation(e.target.value);
    this.props.store.app.setStationR(e.target.value);
  };

  render() {
    // console.log(toJS(this.props.store.app.station.name));
    const { getCurrentStateStations, station } = this.props.store.app;

    const stationList = getCurrentStateStations.map(station => (
      <option key={`${station.id} ${station.network}`}>{station.name}</option>
    ));

    return (
      <Selector>
        <label>
          Weather station:
          <small style={{ paddingLeft: "5px" }}>
            {getCurrentStateStations.length}
          </small>
        </label>

        <Select
          name="station"
          value={station.name}
          onChange={this.handleChange}
        >
          {this.isDisabled ? null : <option>Select Station</option>}
          {stationList}
        </Select>
      </Selector>
    );
  }
}

export default Station;
