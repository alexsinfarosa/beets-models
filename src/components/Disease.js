import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";

// styled-components
import { Select, Selector } from "./styles";

@inject("store")
@observer
class Disease extends Component {
  constructor(props) {
    super(props);
    if (this.props.store.app.disease) {
      this.setIsDisabled(true);
    }
  }
  @observable isDisabled = false;
  @action setIsDisabled = d => this.isDisabled = d;

  handleChange = e => {
    this.setIsDisabled(true);
    this.props.store.app.setDisease(e.target.value);
  };

  render() {
    return (
      <Selector>
        <label>Disease:</label>
        <Select
          name="disease"
          autoFocus
          value={this.props.store.app.disease}
          onChange={this.handleChange}
        >
          {this.isDisabled ? null : <option>Select Disease</option>}
          <option value="Cercospora Beticolaa">Cercospora Beticola</option>
        </Select>
      </Selector>
    );
  }
}

export default Disease;
