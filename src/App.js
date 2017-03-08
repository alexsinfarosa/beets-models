import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import axios from "axios";

// styled-components
import { Page, MyApp } from "./styles";

@inject("store")
@observer
class App extends Component {
  fetchAllStations = () => {
    axios
      .get("http://newa.nrcc.cornell.edu/newaUtil/stateStationList/all")
      .then(res => {
        this.props.store.app.setStations(res.data.stations);
      })
      .catch(err => {
        console.log(err);
        this.props.store.app.setStations([]);
      });
  };

  render() {
    this.fetchAllStations();
    const { stations } = this.props.store.app;
    const stationList = stations.slice(1, 10).map((station, i) => (
      <small key={`${station.id} ${station.network}`}>
        {i} - {station.name}
      </small>
    ));
    return (
      <Page>
        <MyApp>
          {stationList}
        </MyApp>
      </Page>
    );
  }
}

export default App;
