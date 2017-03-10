import { observable, action, computed } from "mobx";
import pestData from "../../public/pestData.json";
import { states, matchIconsToStations } from "../utils";
import { format } from "date-fns";

export default class AppStore {
  // logic---------------------------------------------------------------------------------------
  @observable isSubmitted = false;
  @action setIsSubmitted = d => this.isSubmitted = d;
  @observable isLoading = false;
  @action setIsLoading = d => this.isLoading = d;
  //Pest-----------------------------------------------------------------------------------------
  @observable pests = pestData;
  @observable pest = JSON.parse(localStorage.getItem("pest")) || {};
  @action setPest = informalName => {
    this.pest = this.pests.filter(pest => pest.informalName === informalName)[
      0
    ];
    localStorage.setItem("pest", JSON.stringify(this.pest));
  };
  @observable pestR = {};
  @action setPestR = d => this.pestR = d;

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
    return `${format(this.endDate, "YYYY")}-01-01`;
  }
  @observable endDateR = format(new Date(), "YYYY-MM-DD");
  @action setEndDateR = d => this.endDateR = format(d, "YYYY-MM-DD");
  @computed get startDateR() {
    return `${format(this.endDateR, "YYYY")}-01-01`;
  }
}
