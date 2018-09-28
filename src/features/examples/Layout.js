import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Layouts extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state={
    sideCollapsed: false,
    smallScreen: false,
  }

  render() {
    let { sideCollapsed, smallScreen, navType } = this.state;
    // const {navType, sideType} = this.getPathType();
    return (
      <div className="examples-layout">
        
      </div>
    );
  }
}
