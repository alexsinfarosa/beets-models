import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";

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

// views
import TheMap from "./views/TheMap";
// import Results from '../../views/Results/Results'
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

  calculate = () => {};

  render() {
    const { state } = this.props.store.app;
    return (
      <Router>
        <Page>
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
