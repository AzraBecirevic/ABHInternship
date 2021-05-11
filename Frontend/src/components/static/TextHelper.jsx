import React, { Component } from "react";

export class TextHelper extends Component {
  render() {
    return (
      <div>
        <h5 className="policySubTitle">{this.props.title}</h5>
        <div className="privacyTextDiv">
          <p>{this.props.text}</p>
        </div>
      </div>
    );
  }
}

export default TextHelper;
