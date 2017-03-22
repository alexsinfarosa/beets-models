import React, { Component } from "react";
import { inject, observer } from "mobx-react";

//  styled-components
import { Wrapper, Link } from "./styles";

@inject("store")
@observer
export default class MoreInfo extends Component {
  componentDidMount() {
    this.props.store.app.setIsSubmitted(false);
  }
  render() {
    return (
      <Wrapper>
        <h3>Helpful Information</h3>
        <Link href="https://google.com" target="_blank">- Link 1</Link>
        <Link href="https://google.com" target="_blank">- Link 2</Link>
        <Link href="https://google.com" target="_blank">- Link 3</Link>
      </Wrapper>
    );
  }
}
