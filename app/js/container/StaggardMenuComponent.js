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
      childButtons: [],
      changeScene: false
    }

    this.pos = {x: Math.floor(window.innerWidth / 2), y: Math.floor(window.innerWidth / 3)}

    this.toggleMenu = this.toggleMenu.bind(this)
    this.buttonClicked = this.buttonClicked.bind(this)
  }

  componentDidMount() {
    //window.addEventListener('load', this.animateButtonToCenter())
  }

  animateButtonToCenter() {
    console.log("called")
  }

  mainButtonStyles(number) {
    return {
      width: MAIN_BUTTON_DIAM,
      height: MAIN_BUTTON_DIAM,
      top: this.pos.y - (MAIN_BUTTON_DIAM / 2),
      left: this.pos.x - (MAIN_BUTTON_DIAM / 2),
      transform: `rotate(${number}deg)`,
      MozTransform: `rotate(${number}deg)`,
      msTransform: `rotate(${number}deg)`,
      WebkitTransform: `rotate(${number}deg)`
    }
  }

  expandedMainButtonStyles(number) {
    return {
      borderRadius: 0,
      width: MAIN_BUTTON_DIAM,
      height: MAIN_BUTTON_DIAM,
      top: this.pos.y - (MAIN_BUTTON_DIAM / 2),
      left: this.pos.x - (MAIN_BUTTON_DIAM / 2),
      transform: `scale(${number})`,
      MozTransform: `scale(${number})`,
      msTransform: `scale(${number})`,
      WebkitTransform: `scale(${number})`
    }
  }

  mainButtonRotation(isOpen) {
    return isOpen ? {transform: spring(0, [500, 30])} : {transform: spring(-135, [500, 30])}
  }

  mainButtonExpantion() {
    return {transform: spring(2, [500, 30])}
  }

  toggleMenu() {
    let{isOpen} = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  buttonClicked() {
    this.setState({
      changeScene: !this.state.changeScene,
      isOpen: !this.state.isOpen
    })
  }

  render() {
    let {isOpen, changeScene} = this.state;
    let transformation  = null
    let buttonStyle = null
    let state = isOpen

    let display = changeScene ? 'none' : false

    if (changeScene) {
      transformation = this.mainButtonExpantion
      buttonStyle = this.expandedMainButtonStyles.bind(this)
    } else {
      transformation = this.mainButtonRotation
      buttonStyle = this.mainButtonStyles.bind(this)
    }

    return (
      <div>
        <StaggardMenuChildren
          mainButtonPos={[this.pos.x, this.pos.y]}
          isOpen={isOpen}
          buttonClicked={this.buttonClicked}/>
        <Motion style={transformation(state)}>
          {({transform}) =>
            <div
              className="main-button"
              style={{...buttonStyle(transform)}}
              onClick={this.toggleMenu}>
              {/* Using fa-close instead of fa-plus because fa-plus doesn't center properly */}
              <i className="fa fa-close fa-3x"
                 style={{display}}/>
            </div>
          }
        </Motion>
      </div>
    );
  }
}

export default StaggardMenuComponent
