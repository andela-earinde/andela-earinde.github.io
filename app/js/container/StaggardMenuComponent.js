import React from 'react'

import {Motion, StaggeredMotion, spring} from 'react-motion'
import range from 'lodash/range'

import '../../css/staggard-menu.css'

//Constants
// Value of 1 degree in radians
const DEG_TO_RAD = 0.0174533;
// Diameter of the main button in pixels
const MAIN_BUTTON_DIAM = 100;
const CHILD_BUTTON_DIAM = 70;

// Hard coded position values of the mainButton
const M_X = Math.floor(window.innerWidth / 2);
const M_Y = Math.floor(window.innerWidth / 3);

const OFFSET = 0.4;

const SPRING_CONFIG = [400, 28];

let childButtonIcons = ['github', 'soundcloud', 'linkedin-square', 'twitter'];

let NUM_CHILDREN = childButtonIcons.length;

// How far away from the main button does the child buttons go
const FLY_OUT_RADIUS = 300,
  SEPARATION_ANGLE = 40, //degrees
  FAN_ANGLE = (NUM_CHILDREN - 1) * SEPARATION_ANGLE, //degrees
  BASE_ANGLE = ((180 - FAN_ANGLE)/2); // degrees

// Utility functions

// Since JS Math. functions accept value of angle in radians and we've been working in degrees we will need to covert
// degrees to radians first.
function toRadians(degrees) {
  return degrees * DEG_TO_RAD;
}

function finalChildDeltaPositions(index) {
  let angle = BASE_ANGLE + (index* SEPARATION_ANGLE);
  return {
    deltaX: FLY_OUT_RADIUS * Math.cos(toRadians(angle)) - (CHILD_BUTTON_DIAM/2),
    deltaY: FLY_OUT_RADIUS * Math.sin(toRadians(angle)) + (CHILD_BUTTON_DIAM/2)
  };
}

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

  initialChildButtonStyles() {
    return {
      width: CHILD_BUTTON_DIAM,
      height: CHILD_BUTTON_DIAM,
      top: spring(M_Y - (CHILD_BUTTON_DIAM/2), SPRING_CONFIG),
      left: spring(M_X - (CHILD_BUTTON_DIAM/2), SPRING_CONFIG),
      rotate: spring(-180, SPRING_CONFIG),
      scale: spring(0.5, SPRING_CONFIG)
    };
  }

  finalChildButtonStyles(childIndex) {
    let {deltaX, deltaY} = finalChildDeltaPositions(childIndex);
    return {
      width: CHILD_BUTTON_DIAM,
      height: CHILD_BUTTON_DIAM,
      top: spring(M_Y - deltaY, SPRING_CONFIG),
      left: spring(M_X + deltaX, SPRING_CONFIG),
      rotate: spring(0, SPRING_CONFIG),
      scale: spring(1, SPRING_CONFIG)
    };
  }

 toggleMenu(e) {
    e.stopPropagation();
    let{isOpen} = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  componentDidMount() {
    let childButtons = [];

    this.setState({childButtons: childButtons.slice(0)});
  }

  renderChildButtons() {
    const {isOpen} = this.state;
    const targetButtonStyles = range(NUM_CHILDREN).map(i => {
      return isOpen ? this.finalChildButtonStyles(i) : this.initialChildButtonStyles();
    });

    const scaleMin = this.initialChildButtonStyles().scale.val;
    const scaleMax = this.finalChildButtonStyles(0).scale.val;

    let calculateStylesForNextFrame = prevFrameStyles => {
      prevFrameStyles = isOpen ? prevFrameStyles : prevFrameStyles.reverse();

      let nextFrameTargetStyles =  prevFrameStyles.map((buttonStyleInPreviousFrame, i) => {
        //animation always starts from first button
        if (i === 0) {
          return targetButtonStyles[i];
        }

        const prevButtonScale = prevFrameStyles[i - 1].scale;
        const shouldApplyTargetStyle = () => {
          if (isOpen) {
            return prevButtonScale >= scaleMin + OFFSET;
          } else {
            return prevButtonScale <= scaleMax - OFFSET;
          }
        };

        return shouldApplyTargetStyle() ? targetButtonStyles[i] : buttonStyleInPreviousFrame;
      });

      return isOpen ? nextFrameTargetStyles : nextFrameTargetStyles.reverse();
    };

    return (
      <StaggeredMotion
        defaultStyles={targetButtonStyles}
        styles={calculateStylesForNextFrame}>
        {interpolatedStyles =>
          <div>
            {interpolatedStyles.map(({height, left, rotate, scale, top, width}, index) =>
              <div
                className="child-button"
                key={index}
                style={{
                  left,
                  height,
                  top,
                  transform: `rotate(${rotate}deg) scale(${scale})`,
                  width
                }}>
                <i className={"fa fa-" + childButtonIcons[index] + " fa-2x"}></i>
              </div>
            )}
          </div>
        }
      </StaggeredMotion>
    );
  }

  render() {
    let {isOpen} = this.state;
    let mainButtonRotation = isOpen ? {rotate: spring(0, [500, 30])} : {rotate: spring(-135, [500, 30])};
    return (
      <div>
        {this.renderChildButtons()}
        <Motion style={mainButtonRotation}>
          {({rotate}) =>
            <div
              className="main-button"
              style={{...this.mainButtonStyles(), transform: `rotate(${rotate}deg)`}}
              onClick={this.toggleMenu}>
              {/*Using fa-close instead of fa-plus because fa-plus doesn't center properly*/}
              <i className="fa fa-close fa-3x"/>
            </div>
          }
        </Motion>
      </div>
    );
  }
}

export default StaggardMenuComponent
