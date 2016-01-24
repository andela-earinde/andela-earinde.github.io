import React from 'react'

import {Motion, spring} from 'react-motion'

import StaggardMenuChildren from '../components/StaggardMenuChildren'

import '../../css/staggard-menu.css'

// Diameter of the main button in pixels
const MAIN_BUTTON_DIAM = 100;

// position values of the mainButton
const M_X = Math.floor(window.innerWidth / 2);
const M_Y = Math.floor(window.innerWidth / 3);


class StaggardMenuComponent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      childButtons: []
    }

    this.toggleMenu = this.toggleMenu.bind(this)
  }

  mainButtonStyles() {
    return {
      width: MAIN_BUTTON_DIAM,
      height: MAIN_BUTTON_DIAM,
      top: M_Y - (MAIN_BUTTON_DIAM/2),
      left: M_X - (MAIN_BUTTON_DIAM/2)
    };
  }

 toggleMenu(e) {
    e.stopPropagation();
    let{isOpen} = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  render() {
    let {isOpen} = this.state;
    let mainButtonRotation = isOpen ? {rotate: spring(0, [500, 30])} : {rotate: spring(-135, [500, 30])};

    return (
      <div>
        <StaggardMenuChildren
          mainButtonPos={[M_X, M_Y]}
          isOpen={isOpen}/>
        <Motion style={mainButtonRotation}>
          {({rotate}) =>
            <div
              className="main-button"
              style={{...this.mainButtonStyles(), transform: `rotate(${rotate}deg)`}}
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
