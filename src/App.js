import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
// import { toJS } from "mobx";
// import DevTools from "mobx-react-devtools";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";
// import { format, addDays } from "date-fns";
import _ from "lodash";

// Fetch ACIS Data
import {
  fetchACISData,
  getSisterStationIdAndNetwork,
  fetchSisterStationData,
  fetchForecastData
} from "./FetchData";

// utility functions
import {
  noonToNoon,
  replaceNonConsecutiveMissingValues,
  containsMissingValues,
  replaceConsecutiveMissingValues
} from "./utils";

// styled-components
import {
  Page,
  MyApp,
  Main,
  LeftContainer,
  RightContainer,
  CalculateBtn,
  Ul,
  NavLinkStyled
} from "./styles";

// components
import Testing from "./components/Testing";
import Disease from "./components/Disease";
import State from "./components/State";
import Station from "./components/Station";
import Calendar from "./components/Calendar";

// views
import TheMap from "./views/TheMap";
import Results from "./views/Results/Results";
import MoreInfo from "./views/MoreInfo";

@inject("store")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    when(
      // once...
      () => this.props.store.app.stations.length === 0,
      // ... then
      () => this.fetchAllStations()
    );
  }

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

  calculate = () => {
    const {
      disease,
      state,
      station,
      endDate,
      startDate
    } = this.props.store.app;
    this.props.store.app.setDiseaseR(disease);
    this.props.store.app.setStateR(state);
    this.props.store.app.setStationR(station);
    this.props.store.app.setEndDateR(endDate);

    this.getData(station, startDate, endDate);
    this.props.store.app.setIsSubmitted(true);
    this.props.store.app.setIsLoading(false);
  };

  async getData(station, startDate, endDate) {
    try {
      // Fetch ACIS data
      let acis = await fetchACISData(station, startDate, endDate);
      acis.map(day => console.log(day[1]));
      console.log("----------------------------------");

      // Check if there are missing values
      if (!containsMissingValues(acis)) {
        return this.props.store.app.setACISData(noonToNoon(station, acis));
      }

      // Replacing non consecutive missing values
      acis = replaceNonConsecutiveMissingValues(acis);
      acis.map(day => console.log(day[1]));
      console.log("----------------------------------");

      // Check if there are missing values
      if (!containsMissingValues(acis)) {
        return this.props.store.app.setACISData(noonToNoon(station, acis));
      }

      // Get sister station id and network
      const idAndNetwork = await getSisterStationIdAndNetwork(station);

      // Fetch sister station data
      const sisterStationData = await fetchSisterStationData(
        idAndNetwork,
        startDate,
        endDate
      );

      // Replace acis with sister station data
      acis = replaceConsecutiveMissingValues(sisterStationData, acis);
      acis.map(day => console.log(day[1]));
      console.log("----------------------------------");

      // Check if there are missing values
      if (!containsMissingValues(acis)) {
        return this.props.store.app.setACISData(noonToNoon(station, acis));
      }

      // Fetch forecast data
      const forecastData = await fetchForecastData(station, startDate, endDate);
      forecastData.map(day => console.log(day[1]));
      console.log(forecastData);
      console.log("----------------------------------");

      // Replace acis with forecast data
      acis = replaceConsecutiveMissingValues(forecastData, acis);
      acis.map(day => console.log(day[1]));

      // Check if there are missing values
      // if (!containsMissingValues(acis)) {
      //   return this.props.store.app.setACISData(noonToNoon(station, acis));
      // }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { state, isSubmitted } = this.props.store.app;
    return (
      <Router>
        <Page>
          {/* <DevTools /> */}
          <MyApp>
            <Testing />
            <h2 style={{ marginTop: "0" }}>Beet Model</h2>
            <Main>
              <LeftContainer>

                <Disease />
                <br />
                <State />
                <br />
                <Station />
                <br />
                <Calendar />
                <br />
                <CalculateBtn onClick={this.calculate}>Calculate</CalculateBtn>

              </LeftContainer>

              <RightContainer>

                <Ul>
                  <NavLinkStyled to="/map">Map</NavLinkStyled>
                  <NavLinkStyled to="/results">Results</NavLinkStyled>
                  <NavLinkStyled to="/moreinfo">More Info</NavLinkStyled>
                </Ul>

                <Route
                  exact
                  path="/"
                  render={() =>
                    Object.keys(state).length !== 0 && <Redirect to="/map" />}
                />
                <Route path="/map" component={TheMap} />

                <Route
                  path="/"
                  render={() => isSubmitted && <Redirect to="/results" />}
                />
                <Route path="/results" component={Results} />

                <Route path="/moreinfo" component={MoreInfo} />

              </RightContainer>
            </Main>
          </MyApp>
        </Page>
      </Router>
    );
  }
}

export default App;
