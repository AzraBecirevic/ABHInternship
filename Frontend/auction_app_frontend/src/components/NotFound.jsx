import React, { Component } from "react";
import styles from "./NotFound.css";
import logo from "../assets/logo.PNG";
import { HOME_ROUTE } from "../constants/routes";

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
              <div className="heading404">
                <img className="logo404" src={logo} alt="Logo" />

                <div className="name404">AUCTION</div>
              </div>
              <div className="number404">404</div>
              <div className="message404">
                Ooops! Looks like the page is Not Found
              </div>
              <div className="goBack404Div">
                <button className="goBack404" onClick={this.goBack}>
                  GO BACK
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
