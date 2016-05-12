import React from 'react'

import range from 'lodash/range'

import {StaggeredMotion, spring} from 'react-motion'

import {LinkButton, Button} from './StaggardMenuChildButton'

let childButtonLink = {'github': 'https://github.com/elvongray',
                        'soundcloud': 'https://soundcloud.com/eniola-arinde',
                        'linkedin-square': 'https://ng.linkedin.com/in/arinde-eniola-763b0332',
                        'twitter': 'https://twitter.com/elvongray',
                        'user': 'https://about.me/eniolaarinde'}

let childButtonIcons = Object.keys(childButtonLink)

const CHILD_BUTTON_DIAM = 70;
const SPRING_CONFIG = [192, 5];
const OFFSET = 0.4;

let NUM_CHILDREN = childButtonIcons.length;

//Constants
// Value of 1 degree in radians
const DEG_TO_RAD = 0.0174533;

// How far away from the main button does the child buttons go
const FLY_OUT_RADIUS = 300,
  SEPARATION_ANGLE = 40, //degrees
  FAN_ANGLE = (NUM_CHILDREN - 1) * SEPARATION_ANGLE, //degrees
  BASE_ANGLE = ((180 - FAN_ANGLE)/2); // degrees


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

class StaggardMenuChildren extends React.Component {

  constructor(props) {
    super(props)
  }

  initialChildButtonStyles() {
    return {
      width: CHILD_BUTTON_DIAM,
      height: CHILD_BUTTON_DIAM,
      top: spring(this.props.mainButtonPos[1] - (CHILD_BUTTON_DIAM/2), SPRING_CONFIG),
      left: spring(this.props.mainButtonPos[0] - (CHILD_BUTTON_DIAM/2), SPRING_CONFIG),
      rotate: spring(-180, SPRING_CONFIG),
      scale: spring(0.5, SPRING_CONFIG)
    };
  }

  finalChildButtonStyles(childIndex) {
    let {deltaX, deltaY} = finalChildDeltaPositions(childIndex);
    return {
      width: CHILD_BUTTON_DIAM,
      height: CHILD_BUTTON_DIAM,
      top: spring(this.props.mainButtonPos[1] - deltaY, SPRING_CONFIG),
      left: spring(this.props.mainButtonPos[0] + deltaX, SPRING_CONFIG),
      rotate: spring(0, SPRING_CONFIG),
      scale: spring(1, SPRING_CONFIG)
    };
  }

  render() {
    const {isOpen} = this.props;
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
            {interpolatedStyles.map(({height, left, rotate, scale, top, width}, index) => {
              let display = (<LinkButton
                              icon={childButtonIcons[index]}
                              link={childButtonLink[childButtonIcons[index]]}/>)
              return (
                <div
                  className="child-button"
                  key={index}
                  style={{
                    left,
                    height,
                    top,
                    transform: `rotate(${rotate}deg) scale(${scale})`,
                    MozTransform: `rotate(${rotate}deg) scale(${scale})`,
                    msTransform: `rotate(${rotate}deg) scale(${scale})`,
                    WebkitTransform: `rotate(${rotate}deg) scale(${scale})`,
                    width
                  }}>
                    {display}
                </div>
              )
            })}
          </div>
        }
      </StaggeredMotion>
    );
  }
}


export default StaggardMenuChildren
