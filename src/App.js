import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import axios from "axios";

// styled-components
import { Page, MyApp, Main, LeftContainer, RightContainer } from "./styles";

// components
import Pest from './components/Pest';

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
    // this.fetchAllStations();
    const { stations } = this.props.store.app;
    const stationList = stations.slice(0, 50).map((station, i) => (
      <small key={`${station.id} ${station.network}`}>
        {station.id} {station.network} {station.name}
      </small>
    ));
    return (
      <Page>
        <MyApp>
          <h2>Beets Model</h2>
          <Main>
            <LeftContainer>
              <Pest />
            </LeftContainer>
            <RightContainer>
              Right
            </RightContainer>
          </Main>
        </MyApp>
      </Page>
    );
  }
}

export default App;
