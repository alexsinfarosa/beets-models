import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//styled-components
import {ViewWrapper} from '../../src/components/App/styles.js';

@inject('store')
@observer
export default class Home extends Component {

  render() {

    return (
      <ViewWrapper>
        <h5>Please make a selection from the menu on the left</h5>
      </ViewWrapper>
    )
  }
}
