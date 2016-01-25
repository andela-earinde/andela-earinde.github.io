import React from 'react'

const LinkButton = props => (
  <a href={props.link} target="_blank"
     className="childbutton-link">
    <i className={`fa fa-${props.icon} fa-3x`}>
    </i>
  </a>
)

const Button = props =>  (
  <i
    className={`fa fa-${props.icon} fa-3x`}>
  </i>
)

export default {LinkButton, Button}
