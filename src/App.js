import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";
// import { toJS } from "mobx";
import DevTools from "mobx-react-devtools";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";
import format from "date-fns/format";
import addDays from "date-fns/add_days";

// utility functions
import {
  noonToNoon,
  replaceNonConsecutiveMissingValues,
  containsMissingValues,
  replaceConsecutiveMissingValues,
  michiganIdAdjustment,
  networkTemperatureAdjustment,
  networkHumidityAdjustment
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
    // this.props.store.app.setIsLoading(false);
  };

  // Fetch acis data ---------------------------------------------------------------------------------------------------
  fetchACISData() {
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

    // console.log(params);

    return axios
      .post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          const data = replaceNonConsecutiveMissingValues(res.data.data);
          // console.log("ORIGINAL ACIS DATA TEMP");
          // data.map(day => console.log(day[1].toString()));
          // Check if there are missing values
          if (!containsMissingValues(data)) {
            this.props.store.app.setACISData(noonToNoon(station, data));
            this.props.store.app.setIsLoading(false);
            return;
          }
          return data;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Get sister station Id and network ---------------------------------------------------------------------------------
  getSisterStationIdAndNetwork() {
    const { station } = this.props.store.app;
    return axios(
      `http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`
    )
      .then(res => {
        return res.data.temp;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Fetch sister station data -----------------------------------------------------------------------------------------
  fetchSisterStationData(acis, idAndNetwork) {
    const {
      station,
      startDate,
      endDate,
      currentYear,
      startDateYear
    } = this.props.store.app;
    const [id, network] = idAndNetwork.split(" ");

    const params = {
      sid: `${id} ${network}`,
      sdate: startDate,
      edate: format(addDays(endDate, 6), "YYYY-MM-DD"),
      elems: [
        networkTemperatureAdjustment(network),
        networkHumidityAdjustment(network)
      ]
    };

    console.log(params);

    return axios
      .post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          let data = replaceConsecutiveMissingValues(res.data.data, acis);

          // Check if there are missing values
          if (!containsMissingValues(data)) {
            this.props.store.app.setACISData(noonToNoon(station, data));
            this.props.store.app.setIsLoading(false);
            return;
          }

          if (currentYear !== startDateYear) {
            this.props.store.app.setACISData(noonToNoon(station, data));
            this.props.store.app.setIsLoading(false);
            return;
          }
          return data;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Fetch forecast temperature ----------------------------------------------------------------------------------------
  fetchForecastTemps() {
    const { station, startDate, endDate } = this.props.store.app;
    return axios
      .get(
        `http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
      )
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          return res.data.data;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Fetch forecast relative humidity ----------------------------------------------------------------------------------
  fetchForecastRH() {
    const { station, startDate, endDate } = this.props.store.app;

    return axios
      .get(
        `http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/rhum/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
      )
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          return res.data.data;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Fetch forecast data -----------------------------------------------------------------------------------------------
  fetchForecastData(sisterStationData) {
    const { station } = this.props.store.app;
    return axios
      .all([this.fetchForecastTemps(), this.fetchForecastRH()])
      .then(res => {
        const datesAndTemps = res[0];
        let rhum = res[1].map(day => day[1]);
        // rhum.map(day => console.log(day));
        rhum = rhum.map(day =>
          day.map(e => Math.round(e / (0.0047 * e + 0.53))));

        // rhum.map(day => console.log(day));

        let data = datesAndTemps.map((day, i) => {
          return day.concat([rhum[i]]);
        });

        data = replaceConsecutiveMissingValues(data, sisterStationData);
        // console.error("FORECAST TEMP");
        // data.map(day => console.log(day[2].toString()));

        // Check if there are missing values
        // if (!containsMissingValues(data)) {
        this.props.store.app.setACISData(noonToNoon(station, data));
        this.props.store.app.setIsLoading(false);
        return;
        // }
        // return data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Making the calls --------------------------------------------------------------------------------------------------
  async getData() {
    const { currentYear, startDateYear } = this.props.store.app;
    try {
      // Fetch ACIS data
      let acis = await this.fetchACISData();

      if (acis) {
        // console.error("ACIS TEMP");
        // acis.map(day => console.log(day[2].toString()));
        // Get sister station id and network
        const idAndNetwork = await this.getSisterStationIdAndNetwork();

        // Fetch sister station data
        const sisterStationData = await this.fetchSisterStationData(
          acis,
          idAndNetwork
        );

        if (sisterStationData && currentYear === startDateYear) {
          // console.error("SISTER STATION TEMP");
          // sisterStationData.map(day => console.log(day[2].toString()));
          // Fetch forecast data
          this.fetchForecastData(sisterStationData);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const {
      state,
      isSubmitted,
      areRequiredFieldsSet,
      // ACISData,
      graphData
    } = this.props.store.app;
    // ACISData.map(day => console.log(toJS(day)));
    graphData.slice(0, 2).map(d => console.log(d));
    // console.error("ACISData RH");
    // ACISData.map(e => e.rh).map(e => console.log(e.slice().toString()));
    // console.error("ACISData TEMP");
    // ACISData.map(e => e.temp).map(e => console.log(e.slice().toString()));
    return (
      <Router>
        <Page>
          <DevTools />
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
