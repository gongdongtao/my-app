import React, { Component } from 'react';

export default class Demo extends Component {
  static propTypes = {

  };

  state = {
    inputContent: 'Demo content'
  }

  onBtnClick = (e) => {
    this.setState({inputContent: 'Click content!!!'});
  }

  render() {
    return (
      <div className="examples-demo">
        <input type="text" value={this.state.inputContent} />
        <input type="button" value="Test" onClick={this.onBtnClick} />
      </div>
    );
  }
}
