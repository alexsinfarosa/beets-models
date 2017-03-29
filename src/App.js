import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
// import { toJS } from "mobx";
import DevTools from "mobx-react-devtools";
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
  RHAdjustment
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
  Li,
  A
} from "./styles";

// styles
import "./index.styl";

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
import Home from "./views/Home";

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
        if (this.props.store.app.areRequiredFieldsSet) {
          this.calculate();
        }
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
  };

  // Making the calls -----------------------------------------------------------------------
  async getData() {
    const {
      station,
      currentYear,
      startDateYear,
      startDate,
      endDate,
      setIsResults,
      setIsGraphDisplayed,
      setIsLoading
    } = this.props.store.app;

    let acis = [];

    // Fetch ACIS data
    acis = await fetchACISData(station, startDate, endDate);
    // logData(acis.slice(0, 3));
    acis = replaceNonConsecutiveMissingValues(acis);
    // logData(acis.slice(0, 3));

    if (!containsMissingValues(acis)) {
      acis = currentModel(station, acis);
      console.log("ACIS");
      this.props.store.app.setACISData(acis);
      setIsGraphDisplayed(true);
      setIsResults();
      setIsLoading(false);
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
    if (currentYear !== startDateYear) {
      acis = currentModel(station, acis);
      console.log("Sister");
      this.props.store.app.setACISData(acis);
      setIsGraphDisplayed(true);
      setIsResults();
      setIsLoading(false);
      return;
    }

    let forecastData = await fetchForecastData(station, startDate, endDate);
    forecastData = RHAdjustment(forecastData);
    acis = replaceConsecutiveMissingValues(forecastData, acis);
    acis = currentModel(station, acis);
    console.log("Forecast");
    this.props.store.app.setACISData(acis);
    setIsGraphDisplayed(true);
    setIsResults();
    setIsLoading(false);
    return;
  }

  render() {
    const {
      areRequiredFieldsSet,
      isMap,
      isResults,
      isMoreInfo,
      setIsMap,
      setIsResults,
      setIsMoreInfo,
      isLoading
    } = this.props.store.app;

    const ViewComponent = () => {
      if (isMap) {
        return <TheMap />;
      } else if (isResults) {
        return <Results />;
      } else if (isMoreInfo) {
        return <MoreInfo />;
      }
      return <Home />;
    };

    return (
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
                <Li onClick={setIsMap} className={isMap ? "active" : null}>
                  <A>Map</A>
                </Li>
                {!isLoading
                  ? <Li
                      onClick={setIsResults}
                      className={isResults ? "active" : null}
                    >
                      <A>Results</A>
                    </Li>
                  : null}
                <Li
                  onClick={setIsMoreInfo}
                  className={isMoreInfo ? "active" : null}
                >
                  <A>More Info</A>
                </Li>
              </Ul>

              <div>
                {ViewComponent()}
              </div>
            </RightContainer>
          </Main>
        </MyApp>
      </Page>
    );
  }
}

export default App;
