import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import Loader from "react-loader-spinner";
import styles from "./LoadingSpinner.css";

export class LoadingSpinner extends Component {
  render() {
    return (
      <div className="loadingSpinnerContainer">
        <Loader
          className="loader"
          type="ThreeDots"
          color="#8367d8"
          height="100"
          width="100"
        />
      </div>
    );
  }
}

export default LoadingSpinner;
