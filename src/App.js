import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
// import DevTools from "mobx-react-devtools";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";
import { format, addDays } from "date-fns";
import _ from "lodash";

// utility functions
import {
  noonToNoon,
  networkHumidityAdjustment,
  networkTemperatureAdjustment,
  michiganIdAdjustment
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
    const { disease, state, station, endDate } = this.props.store.app;
    this.props.store.app.setDiseaseR(disease);
    this.props.store.app.setStateR(state);
    this.props.store.app.setStationR(station);
    this.props.store.app.setEndDateR(endDate);

    this.getACISData();
    this.props.store.app.setIsSubmitted(true);
    this.props.store.app.setIsLoading(false);
    console.log("clicked!");
  };

  getACISData() {
    const { station, startDate, endDate } = this.props.store.app;

    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: startDate,
      // Plus 6 days because we account for the noonToNoon function
      edate: format(addDays(endDate, 6), "YYYY-MM-DD"),
      elems: [
        networkTemperatureAdjustment(station.network),
        networkHumidityAdjustment(station.network)
      ]
    };

    console.log(params);

    return axios
      .post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          const data = noonToNoon(res.data.data);
          this.props.store.app.setACISData(data);
          // console.log(data.map(d => d.date));
          return data;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    // const {
    //   diseaseR,
    //   stationR,
    //   startDateR,
    //   endDateR
    // } = this.props.store.app;

    // console.log(diseaseR);
    // console.log(toJS(diseaseR));
    // console.log(toJS(stationR));
    // console.log(startDateR);
    // console.log(endDateR);

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
