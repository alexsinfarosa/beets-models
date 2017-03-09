import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

// styled-components
import {Select, Selector} from './styles'

@inject('store') @observer
class PestSelector extends Component {

    @observable isDisabled = false;
    @action setIsDisabled = d => this.isDisabled = d;

    handleChange = e => {
      this.setIsDisabled(true)
      this.props.store.app.setPest(e.target.value)
    }

  render () {
    // console.log(toJS(this.props.store.app.pest))
    const {pests} = this.props.store.app;

    const pestList = pests.map(pest =>
      <option key={pest.id} value={pest.informalName}>{pest.informalName}</option>
    )

    return (
      <Selector>
        <label>Pest:</label>
        <Select
          name="pest"
          autoFocus
          value={this.props.store.app.pest.informalName}
          onChange={this.handleChange}
        >
          {this.isDisabled ? null : <option>Select Pest</option>}
          {pestList}
        </Select>
      </Selector>
    )
  }
}

export default PestSelector;
