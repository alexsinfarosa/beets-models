import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-spinkit';

// Images
import newaPic from './images/newa_logo.jpg';
import acisPic from './images/PoweredbyACIS_NRCC.jpg';

// Components
import ResultsHeader from './ResultsHeader';
import ResultsTable from './ResultsTable';
import ResultsStage from './ResultsStage';

// style
// import './results.css';

//  styled-components
import {ResultsWrapper, Images, Img} from '../../components/App/styles'

@inject('store')
@observer
export default class Results extends Component {
  render() {
    const {ready} = this.props.store.app
    if(!ready) {
      return (
        <div className="centered">
          Loading <Spinner spinnerName='circle' noFadeIn style={{marginLeft: '10px'}}/>
        </div>
      )
    } else {
    return (
      <ResultsWrapper>

        {/* HEADER */}
        <ResultsHeader />

        <br />

        {/* DATA */}
        <ResultsTable />

        {/* DETAILS STAGE */}
        <ResultsStage />

        {/* IMAGES */}
        <Images>
          <figure>
            <a href="http://newa.cornell.edu/">
              <Img src={newaPic} alt="newa" />
            </a>
          </figure>
          <figure>
            <a href="http://www.rcc-acis.org/">
              <Img src={acisPic} alt="acis" />
            </a>
          </figure>
        </Images>

      </ResultsWrapper>
    );
    }
  }
}
