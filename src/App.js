import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
// import { toJS } from "mobx";
import DevTools from "mobx-react-devtools";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";

// fetch functions
import {
  fetchACISData,
  getSisterStationIdAndNetwork,
  fetchSisterStationData,
  fetchForecastData
} from "./fetchData";

// utility functions
import {
  currentModel,
  replaceNonConsecutiveMissingValues,
  containsMissingValues,
  replaceConsecutiveMissingValues,
  logData
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
      // rhum = station reporting relative humidity
      .get("http://newa.nrcc.cornell.edu/newaUtil/stateStationList/all")
      .then(res => {
        this.props.store.app.setStations(res.data.stations);
        this.calculate();
        this.props.store.app.setIsGraphDisplayed(true);
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
      endDate
    } = this.props.store.app;
    this.props.store.app.setDiseaseR(disease);
    this.props.store.app.setStateR(state);
    this.props.store.app.setStationR(station);
    this.props.store.app.setEndDateR(endDate);

    this.getData();
    this.props.store.app.setIsSubmitted(true);
    this.props.store.app.setIsLoading(false);
  };

  // Making the calls -----------------------------------------------------------------------
  async getData() {
    const {
      station,
      currentYear,
      startDateYear,
      startDate,
      endDate
    } = this.props.store.app;

    let acis = [];

    // Fetch ACIS data
    acis = await fetchACISData(station, startDate, endDate);
    // logData(acis.slice(0, 3));
    acis = replaceNonConsecutiveMissingValues(acis);
    // logData(acis.slice(0, 3));

    if (!containsMissingValues(acis)) {
      acis = currentModel(station, acis);
      this.props.store.app.setACISData(acis);
      return;
    }

    // Get Id and network to fetch sister station data
    const idAndNetwork = await getSisterStationIdAndNetwork(station);
    const sisterStationData = await fetchSisterStationData(
      idAndNetwork,
      station,
      startDate,
      endDate,
      currentYear,
      startDateYear
    );

    acis = replaceConsecutiveMissingValues(sisterStationData, acis);
    // logData(acis.slice(0, 3));
    if (!containsMissingValues(acis) && currentYear !== startDateYear) {
      acis = currentModel(station, acis);
      this.props.store.app.setACISData(acis);
      return;
    }

    const forecastData = await fetchForecastData(station, startDate, endDate);
    // logData(forecastData);
    acis = replaceConsecutiveMissingValues(forecastData, acis);
    acis = currentModel(station, acis);
    this.props.store.app.setACISData(acis);
    return;
  }

  render() {
    const {
      state,
      isSubmitted,
      areRequiredFieldsSet
    } = this.props.store.app;
    // console.log(this.props.store.app.isLoading);
    // console.log(this.props.store.app.isSubmitted);

    return (
      <Router>
        <Page>
          <DevTools />
          <MyApp>
            <Testing />
            <h2 style={{ marginTop: "0" }}>
              Cercospora Beticola Infection Prediction Model
            </h2>
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
                {areRequiredFieldsSet
                  ? <CalculateBtn onClick={this.calculate}>
                      Calculate
                    </CalculateBtn>
                  : <CalculateBtn inactive onClick={this.calculate}>
                      Calculate
                    </CalculateBtn>}

              </LeftContainer>

              <RightContainer>

                <Ul>
                  <NavLinkStyled
                    exact
                    activeStyle={{
                      color: "#b85700",
                      backgroundColor: "#F4F0EC",
                      marginBottom: "-1px"
                    }}
                    to="/map"
                  >
                    Map
                  </NavLinkStyled>
                  <NavLinkStyled
                    exact
                    activeStyle={{
                      color: "#b85700",
                      backgroundColor: "#F4F0EC",
                      marginBottom: "-1px"
                    }}
                    to="/results"
                  >
                    Results
                  </NavLinkStyled>
                  <NavLinkStyled
                    exact
                    activeStyle={{
                      color: "#b85700",
                      backgroundColor: "#F4F0EC",
                      marginBottom: "-1px"
                    }}
                    to="/moreinfo"
                  >
                    More Info
                  </NavLinkStyled>
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
