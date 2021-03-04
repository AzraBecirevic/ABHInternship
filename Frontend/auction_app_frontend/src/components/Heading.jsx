import React, { Component } from "react";
import styles from "./Heading.css";

export class Heading extends Component {
  render() {
    return (
      <div className="pageHeadingDiv">
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <p className="pageHeadingTitle">{this.props.title}</p>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    );
  }
}

export default Heading;
