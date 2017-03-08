import { observable, action, computed } from 'mobx';

export default class AppStore {
  @observable name = 'ciccio'
  @observable stations = [];
  @action setStations = d => this.stations = d;
}
