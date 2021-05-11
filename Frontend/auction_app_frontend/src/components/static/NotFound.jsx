import React, { Component } from "react";
import styles from "./NotFound.css";
import logo from "../../assets/logo.PNG";
import { HOME_ROUTE } from "../../constants/routes";
import {
  GO_BACK_MESSAGE,
  PAGE_NOT_FOUND_MESSAGE,
} from "../../constants/messages";
import { Link } from "react-router-dom";

export class NotFound extends Component {
  goBack = () => {
    this.props.history.push(HOME_ROUTE);
  };

  render() {
    return (
      <div className="row row404">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="number404">404</div>
              <div className="message404">{PAGE_NOT_FOUND_MESSAGE}</div>
              <div className="goBack404Div">
                <button className="goBack404" onClick={this.goBack}>
                  {GO_BACK_MESSAGE}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4"></div>
      </div>
    );
  }
}

export default NotFound;

/*

<div className="heading404">
                <img className="logo404" src={logo} alt="Logo" />

                <div className="name404">AUCTION</div>
              </div>

*/
