import React from 'react'
import ReactDOM from 'react-dom'

import ParticleRenderer from './container/ParticleRenderer'
import StaggardMenuComponent from './container/StaggardMenuComponent'

import '../css/style.css'

class App extends React.Component {

  render() {
    return (
      <div className="container">
        <ParticleRenderer />
        <StaggardMenuComponent />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
