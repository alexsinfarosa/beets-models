import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
import DevTools from "mobx-react-devtools";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";
import { format, addDays } from "date-fns";

// utility functions
import {
  networkTemperatureAdjustment,
  michiganIdAdjustment,
  flattenArray,
  unflattenArray,
  calculateDegreeDay,
  replaceSingleMissingValues,
  replaceConsecutiveMissingValues,
  // weightedAverage,
  calculateMissingValues
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
import Pest from "./components/Pest";
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
    const { pest, state, station, endDate } = this.props.store.app;
    this.props.store.app.setPestR(pest);
    this.props.store.app.setStateR(state);
    this.props.store.app.setStationR(station);
    this.props.store.app.setEndDateR(endDate);

    this.getACISData();
    this.props.store.app.setIsSubmitted(true);
    this.props.store.app.setIsLoading(false);
    console.log("clicked!");
  };

  getACISData() {
    const { pest, station, startDate, endDate } = this.props.store.app;

    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: startDate,
      edate: format(addDays(endDate, 5), "YYYY-MM-DD"),
      elems: networkTemperatureAdjustment(station.network)
    };

    console.log(params);

    return axios
      .post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          this.props.store.app.setACISData(res.data.data);
          const acisFlat = flattenArray(res.data.data);
          const acis = replaceSingleMissingValues(acisFlat);
          if (acis.filter(e => e === "M").length === 0) {
            this.props.store.app.setDegreeDays(
              calculateDegreeDay(pest, unflattenArray(acis))
            );
            return;
          }
          return acis;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { state, isSubmitted } = this.props.store.app;
    console.log(this.props.store.app.ACISData.slice());
    return (
      <Router>
        <Page>
          <DevTools />
          <MyApp>
            <h2 style={{ marginTop: "0" }}>Beet Model</h2>
            <Main>
              <LeftContainer>

                <Pest />
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
