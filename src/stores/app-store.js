import { observable, action, computed } from 'mobx';
import pestData from '../../public/pestData.json';

export default class AppStore {
  @observable pests = pestData
  @observable pest = {}
  @action setPest = d => this.pest = d

  @observable stations = [];
  @action setStations = d => this.stations = d;
}
