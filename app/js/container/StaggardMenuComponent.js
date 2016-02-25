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
      pos: {x: Math.floor(window.innerWidth / 2), y: Math.floor(window.innerWidth / 3)}
    }

    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount() {
    if (window.innerWidth < window.innerHeight) {
        this.setState({
          pos: {x: Math.floor(window.innerWidth / 3), y: Math.floor(window.innerWidth / 2)}
        })
    }
    window.addEventListener('resize', () => {
      console.log(window.innerHeight, window.innerWidth);
      if (window.innerWidth < window.innerHeight) {
        this.setState({
          pos: {x: Math.floor(window.innerWidth / 3), y: Math.floor(window.innerWidth / 2)}
        })
      } else {
        this.setState({
          pos: {x: Math.floor(window.innerWidth / 2), y: Math.floor(window.innerWidth / 3)}
        })
      }
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
    let {isOpen, changeScene} = this.state;
    let transformation  = null
    let buttonStyle = null

    let display = changeScene ? 'none' : false

    transformation = this.mainButtonRotation
    buttonStyle = this.mainButtonStyles.bind(this)

    return (
      <div>
        <StaggardMenuChildren
          mainButtonPos={[this.state.pos.x, this.state.pos.y]}
          isOpen={isOpen}
          buttonClicked={this.buttonClicked}/>
        <Motion style={transformation(isOpen)}>
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
