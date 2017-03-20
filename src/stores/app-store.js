import { observable, action, computed } from "mobx";
import {
  states,
  matchIconsToStations,
  lookUpToTable,
  cumulativeDICV
} from "../utils";
import { table } from "../views/Results/table";
import { format } from "date-fns";

export default class AppStore {
  // logic---------------------------------------------------------------------------------------
  @observable isSubmitted = false;
  @action setIsSubmitted = d => this.isSubmitted = d;
  @observable isLoading = true;
  @action setIsLoading = d => this.isLoading = d;
  @observable missingValue = 0;
  @action setMissingValue = d => this.missingValue = d;
  @computed get areRequiredFieldsSet() {
    return Object.keys(this.state && this.station).length !== 0 &&
      this.disease.length !== 0;
  }
  @observable isGraphDisplayed = false;
  @action setIsGraphDisplayed = () =>
    this.isGraphDisplayed = !this.isGraphDisplayed;
  @observable dailyGraph = true;
  @action setDailyGraph = () => this.dailyGraph = !this.dailyGraph;

  //Disease--------------------------------------------------------------------------------------
  @observable disease = JSON.parse(localStorage.getItem("disease")) || "";
  @action setDisease = d => {
    this.disease = d;
    localStorage.setItem("disease", JSON.stringify(this.disease));
  };
  @observable selectDisease = this.disease ? true : false;
  @action setSelectDisease = d => this.selectDisease = d;
  @observable diseaseR = "";
  @action setDiseaseR = d => this.diseaseR = d;

  //State----------------------------------------------------------------------------------------
  @observable state = JSON.parse(localStorage.getItem("state")) || {};
  @action setState = stateName => {
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem("state", JSON.stringify(this.state));
  };
  @observable selectState = this.state.name ? true : false;
  @action setSelectState = d => this.selectState = d;
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
  @observable selectStation = this.station.name ? true : false;
  @action setSelectStation = d => this.selectStation = d;
  @observable stationR = {};
  @action setStationR = d => this.stationR = d;

  // Dates---------------------------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();
  @observable endDate = JSON.parse(localStorage.getItem("endDate")) ||
    format(new Date(), "YYYY-MM-DD");
  @action setEndDate = d => {
    this.endDate = format(d, "YYYY-MM-DD");
    localStorage.setItem("endDate", JSON.stringify(this.endDate));
  };
  @computed get startDate() {
    return `${format(this.endDate, "YYYY")}-04-23`;
  }
  @computed get startDateYear() {
    return format(this.endDate, "YYYY");
  }
  @observable endDateR = format(new Date(), "YYYY-MM-DD");
  @action setEndDateR = d => this.endDateR = format(d, "YYYY-MM-DD");
  @computed get startDateR() {
    return `${format(this.endDateR, "YYYY")}-04-23`;
  }

  // ACISData -----------------------------------------------------------------------------------
  @observable ACISData = [];
  @action setACISData = d => this.ACISData = d;
  @computed get dates() {
    return this.ACISData.map(e => e.date);
  }
  @computed get rhs() {
    return this.ACISData.map(e => e.rh);
  }
  @computed get temps() {
    return this.ACISData.map(e => e.temp);
  }
  @computed get avgTs() {
    return this.ACISData.map(e => e.avgT);
  }
  @computed get hrsRHs() {
    return this.ACISData.map(e => e.hrsRH);
  }
  @computed get DICV() {
    return this.ACISData.map((day, i) => {
      if (day.avgT > 58 && day.avgT < 95) {
        return lookUpToTable(table, day.hrsRH.toString(), day.avgT.toString());
      }
      return 0;
    });
  }
  @computed get A2Day() {
    return this.DICV.map((e, i) => {
      if (i > 0) {
        return e + this.DICV[i - 1];
      }
      return e;
    });
  }
  @computed get infectionRisk() {}

  @computed get graphData() {
    let high = 7;
    if (this.dailyGraph) {
      high = Math.max(...this.DICV);
    } else {
      high = Math.max(...this.A2Day);
    }
    return this.ACISData.map((day, i) => {
      return {
        dates: format(this.dates[i], "MMM D"),
        daily: this.DICV[i],
        a2Day: this.A2Day[i],
        hrs: this.hrsRHs[i],
        low: 5,
        caution: 6,
        high: high < 6 ? null : high
      };
    });
  }
  // @computed get A14Day() {
  //   const arrStart = this.DICV.slice(0, 14);
  //   const sumArrStart = arrStart.reduce((acc, val) => acc + val);
  //   let results = this.DICV.slice(14);
  //   results.unshift(sumArrStart);
  //   return cumulativeDICV(results);
  // }
  // @computed get A21Day() {
  //   const arrStart = this.DICV.slice(0, 21);
  //   const sumArrStart = arrStart.reduce((acc, val) => acc + val);
  //   let results = this.DICV.slice(21);
  //   results.unshift(sumArrStart);
  //   return cumulativeDICV(results);
  // }
  @computed get season() {
    return cumulativeDICV(this.DICV);
  }
  @computed get A14Day() {
    const partial = this.DICV.slice(-22); // to be fixed if date is to close to April 23rd
    return cumulativeDICV(partial);
  }
  @computed get A21Day() {
    const partial = this.DICV.slice(-29);
    return cumulativeDICV(partial);
  }
}
