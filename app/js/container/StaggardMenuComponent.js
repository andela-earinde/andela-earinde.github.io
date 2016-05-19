import React from 'react'

import {Motion, spring} from 'react-motion'

import StaggardMenuChildren from '../components/StaggardMenuChildren'

import '../../css/staggard-menu.css'

// Diameter of the main button in pixels
const MAIN_BUTTON_DIAM = 100;

class StaggardMenuComponent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      pos: {x: Math.floor(window.innerWidth / 2), y: Math.floor((window.innerHeight * 2) / 3)}
    }

    this.mainButtonStyles = this.mainButtonStyles.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        pos: {x: Math.floor(window.innerWidth / 2), y: Math.floor((window.innerHeight * 2) / 3)}
      })
    });
  }

  mainButtonStyles(number) {
    return {
      width: MAIN_BUTTON_DIAM,
      height: MAIN_BUTTON_DIAM,
      top: this.state.pos.y - (MAIN_BUTTON_DIAM / 2),
      left: this.state.pos.x - (MAIN_BUTTON_DIAM / 2),
      transform: `rotate(${number}deg)`,
      MozTransform: `rotate(${number}deg)`,
      msTransform: `rotate(${number}deg)`,
      WebkitTransform: `rotate(${number}deg)`
    }
  }

  mainButtonRotation(isOpen) {
    return isOpen ? {transform: spring(0, [192, 2])} : {transform: spring(-135, [192, 2])}
  }

  toggleMenu() {
    let {isOpen} = this.state;

    this.setState({
      isOpen: !isOpen
    })
  }

  render() {
    let {isOpen} = this.state;

    return (
      <div>
        <StaggardMenuChildren
          mainButtonPos={[this.state.pos.x, this.state.pos.y]}
          isOpen={isOpen}/>
        <Motion style={this.mainButtonRotation(isOpen)}>
          {({transform}) =>
            <div
              className="main-button"
              style={{...this.mainButtonStyles(transform)}}
              onClick={this.toggleMenu}>
              {/* Using fa-close instead of fa-plus because fa-plus doesn't center properly */}
              <i className="fa fa-close fa-3x"/>
            </div>
          }
        </Motion>
      </div>
    );
  }
}

export default StaggardMenuComponent
