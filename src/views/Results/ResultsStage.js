import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
// import {toJS} from 'mobx'

@inject('store') @observer
class ResultsStage extends Component {

  state = {
    isDisabled: false,
    localStage: {},
    edited: false
  }

  handleChange = (e) => {
    const {rPest} = this.props.store.app
    this.setState({isDisabled: true})
    const localStage = rPest.preBiofix.filter(stage => stage.stage === e.target.value)[0]
    this.setState({localStage})
    this.setState({edited: true})
  }

  render() {
    const { rPest, getStage } = this.props.store.app
    const {isDisabled, localStage, edited} = this.state

    const stageList = rPest.preBiofix.map(stage =>
        <option key={stage.id}>{stage.stage}</option>
    )

    if (getStage) {
    return (
      <div className="has-text-centered" style={{'marginTop': '20px'}}>
          <label>Phenological Stage: </label>
          <select
            className='stage'
            name="stage"
            value={edited ? localStage.stage : getStage.stage}
            onChange={this.handleChange}
          >
            {isDisabled ? null : <option>Select Stage</option>}
            {stageList}
          </select>
          <p><small>The phenological stage above is estimated. Select the actual stage and the model will recalculate recommendations.</small></p>

          <div>
            <table>
              <thead>
                <tr>
                  <th className="stageHeader">Pest Status</th>
                  <th className="stageHeader">Pest Management</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="has-text-centered">{edited ? localStage.management : getStage.management}</td>
                  <td className="has-text-centered">{edited ? localStage.status : getStage.status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <br />

          {/* DISCLAIMER */}
          <div>
              <p>
                <small>
                  <strong>
                    Disclaimer: These are theoretical predictions and forecasts
                  </strong>
                  . The theoretical models predicting pest development or disease risk use the weather data collected (or forecasted) from the weather station location. These results should not be substituted for actual observations of plant growth stage, pest presence, and disease occurrence determined through scouting or insect pheromone traps.
                </small>
              </p>
          </div>

      </div>
      )
    } else {
      return (null)
    }
  }
}

export default ResultsStage;
