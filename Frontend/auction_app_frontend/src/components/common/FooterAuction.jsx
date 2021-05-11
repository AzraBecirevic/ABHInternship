import { Link } from "react-router-dom";
import styles from "./FooterAuction.css";

import React, { Component } from "react";
import {
  ABOUT_ROUTE,
  PRIVACY_POLICY_ROUTE,
  TEARMS_CONDITIONS_ROUTE,
} from "../../constants/routes";

export class FooterAuction extends Component {
  render() {
    return (
      <div className="footerInfo">
        <p className="footerInfoHeading">AUCTION</p>
        <ul className="infoList">
          <li className="infoListLi">
            <Link to={ABOUT_ROUTE} className="infoLink">
              About us
            </Link>
          </li>
          <li className="infoListLi">
            <Link to={TEARMS_CONDITIONS_ROUTE} className="infoLink">
              Terms and Conditions
            </Link>
          </li>
          <li className="infoListLi">
            <Link to={PRIVACY_POLICY_ROUTE} className="infoLink">
              Privacy and Policy
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default FooterAuction;
