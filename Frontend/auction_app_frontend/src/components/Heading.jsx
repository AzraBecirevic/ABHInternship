import React, { Component } from "react";
import styles from "./Heading.css";

export class Heading extends Component {
  render() {
    return (
      <div className="pageHeadingDiv">
        <div className="row pageHeadingDivRow">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 pageHeadingDivCol">
            <div className="row">
              <div className="col-lg-6 col-sm-6">
                <div className="pageHeadingTitle">{this.props.title}</div>
                {this.props.didYouMeanMessage !== "" && (
                  <div>
                    <span className="didYouMeanMessage">
                      {this.props.didYouMeanMessage}
                      <span>{"  "}</span>
                    </span>
                    <span className="didYouMeanValue">
                      {this.props.didYouMeanValue}
                    </span>
                  </div>
                )}
              </div>
              <div className="col-lg-6 col-sm-6 ">
                {" "}
                {this.props.secondTitle !== undefined && (
                  <div className="pageHeadingTitle right">
                    <div> {this.props.secondTitle}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    );
  }
}

export default Heading;

/*
<div className="col-lg-8">
            <div className="headingTitleDiv">
              <div className="pageHeadingTitle">{this.props.title}</div>
              {this.props.secondTitle !== undefined && (
                <div className="pageHeadingTitle">{this.props.secondTitle}</div>
              )}
            </div>
          </div>
*/
