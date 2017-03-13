import { observable, action, computed } from "mobx";
import { states, matchIconsToStations } from "../utils";
import { format } from "date-fns";

export default class AppStore {
  // logic---------------------------------------------------------------------------------------
  @observable isSubmitted = false;
  @action setIsSubmitted = d => this.isSubmitted = d;
  @observable isLoading = true;
  @action setIsLoading = d => this.isLoading = d;
  @observable missingValue = 0;
  @action setMissingValue = d => this.missingValue = d;

  //Disease---------------------------------------------------------------------------------------
  @observable disease = JSON.parse(localStorage.getItem("disease")) || "";
  @action setDisease = d => {
    this.disease = d;
    localStorage.setItem("disease", JSON.stringify(this.disease));
  };
  @observable diseaseR = "";
  @action setDiseaseR = d => this.diseaseR = d;

  //State----------------------------------------------------------------------------------------
  @observable state = JSON.parse(localStorage.getItem("state")) || {};
  @action setState = stateName => {
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem("state", JSON.stringify(this.state));
  };
  @observable stateR = {};
  @action setStateR = d => this.stateR = d;

  //Station--------------------------------------------------------------------------------------
  @observable stations = [];
  @action setStations = d => this.stations = d;
  @computed get stationsWithMatchedIcons() {
    return matchIconsToStations(this.stations, this.state);
  }
  @computed get getCurrentStateStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }
  @observable station = JSON.parse(localStorage.getItem("station")) || {};
  @action setStation = stationName => {
    this.station = this.stations.filter(
      station => station.name === stationName
    )[0];
    localStorage.setItem("station", JSON.stringify(this.station));
  };
  @observable stationR = {};
  @action setStationR = d => this.stationR = d;

  // Dates---------------------------------------------------------------------------------------
  @observable endDate = format(new Date(), "YYYY-MM-DD");
  @action setEndDate = d => this.endDate = format(d, "YYYY-MM-DD");
  @computed get startDate() {
    return `${format(this.endDate, "YYYY")}-06-15`;
  }
  @observable endDateR = format(new Date(), "YYYY-MM-DD");
  @action setEndDateR = d => this.endDateR = format(d, "YYYY-MM-DD");
  @computed get startDateR() {
    return `${format(this.endDateR, "YYYY")}-06-15`;
  }

  // ACISData -----------------------------------------------------------------------------------
  @observable ACISData = [];
  @action setACISData = d => this.ACISData = d;
  @computed get dates() {
    return this.ACISData.map(e => e.date);
  }
  @computed get hums() {
    return this.ACISData.map(e => e.hum);
  }
  @computed get temps() {
    return this.ACISData.map(e => e.temp);
  }
}
