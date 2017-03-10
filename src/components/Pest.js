import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";

// styled-components
import { Select, Selector } from "./styles";

@inject("store")
@observer
class Pest extends Component {
  constructor(props) {
    super(props);
    if (this.props.store.app.pest.informalName) {
      this.setIsDisabled(true);
    }
  }
  @observable isDisabled = false;
  @action setIsDisabled = d => this.isDisabled = d;

  handleChange = e => {
    this.setIsDisabled(true);
    this.props.store.app.setPest(e.target.value);
  };

  render() {
    const { pests, pest } = this.props.store.app;

    const pestList = pests.map(pest => (
      <option key={pest.id} value={pest.informalName}>
        {pest.informalName}
      </option>
    ));

    return (
      <Selector>
        <label>Pest:</label>
        <Select
          name="pest"
          autoFocus
          value={pest.informalName}
          onChange={this.handleChange}
        >
          {this.isDisabled ? null : <option>Select Pest</option>}
          {pestList}
        </Select>
      </Selector>
    );
  }
}

export default Pest;
