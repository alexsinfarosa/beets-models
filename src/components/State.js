import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";

// Utilities
import { states } from "../utils";

// styled-components
import { Select, Selector } from "./styles";

@inject("store")
@observer
class State extends Component {
  constructor(props) {
    super(props);
    if (this.props.store.app.state.name) {
      this.setIsDisabled(true);
    }
  }
  @observable isDisabled = false;
  @action setIsDisabled = d => this.isDisabled = d;

  handleChange = e => {
    this.setIsDisabled(true);
    this.props.store.app.setState(e.target.value);
  };

  render() {
    const { state } = this.props.store.app;
    const stateList = states.map(state => (
      <option key={state.postalCode}>{state.name}</option>
    ));

    return (
      <Selector>
        <label>State:</label>
        <Select name="state" value={state.name} onChange={this.handleChange}>
          {this.isDisabled ? null : <option>Select State</option>}
          {stateList}
        </Select>
      </Selector>
    );
  }
}
export default State;
