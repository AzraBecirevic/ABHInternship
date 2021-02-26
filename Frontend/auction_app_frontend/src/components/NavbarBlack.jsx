import styles from "./NavbarBlack.css";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faGooglePlus } from "@fortawesome/free-brands-svg-icons";

import React, { Component } from "react";
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "../constants/routes";

export class NavbarBlack extends Component {
  googleLink =
    "https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp";
  facebookLink = "https://www.facebook.com/";
  instagramLink = "https://www.instagram.com/";
  twitterLink = "https://twitter.com/";

  openWebPage = (e, link) => {
    this.props.openWebPage(e, link);
  };

  render() {
    let divUser;
    if (!this.props.isLoggedIn) {
      divUser = (
        <div className="registerLogin">
          <Link to={LOGIN_ROUTE} className="upperLink">
            Login
          </Link>
          <a className="disabledLink">or</a>
          <Link to={REGISTER_ROUTE} className="upperLink">
            Create account
          </Link>
        </div>
      );
    } else {
      divUser = (
        <div className="registerLogin">
          <a className="disabledLink">{this.props.email}</a>
          <Link
            to={HOME_ROUTE}
            onClick={this.props.logout}
            className="upperLink"
          >
            Logout
          </Link>
        </div>
      );
    }

    return (
      <Navbar className="upperBlack">
        <Nav className="firstNav">
          <div className="socialMediaLinks">
            <ul className="socMediaList">
              <li className="listItem">
                <FontAwesomeIcon
                  icon={faFacebook}
                  size={"lg"}
                  onClick={(e) => this.openWebPage(e, this.facebookLink)}
                />
              </li>
              <li className="listItem">
                <FontAwesomeIcon
                  icon={faInstagramSquare}
                  size={"lg"}
                  onClick={(e) => this.openWebPage(e, this.instagramLink)}
                />
              </li>
              <li className="listItem">
                <FontAwesomeIcon
                  icon={faTwitterSquare}
                  size={"lg"}
                  onClick={(e) => this.openWebPage(e, this.twitterLink)}
                />
              </li>
              <li className="listItem">
                <FontAwesomeIcon
                  icon={faGooglePlus}
                  size={"lg"}
                  onClick={(e) => this.openWebPage(e, this.googleLink)}
                />
              </li>
            </ul>
          </div>
          {divUser}
        </Nav>
      </Navbar>
    );
  }
}

export default NavbarBlack;
