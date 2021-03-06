import styles from "./NavbarBlack.css";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faGooglePlus } from "@fortawesome/free-brands-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import React, { Component } from "react";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from "../../constants/routes";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

export class NavbarBlack extends Component {
  googleLink =
    "https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp";
  facebookLink = "https://www.facebook.com/";
  instagramLink = "https://www.instagram.com/";
  twitterLink = "https://twitter.com/";

  openWebPage = (e, link) => {
    this.props.openWebPage(e, link);
  };

  showNotifications = (e) => {
    this.props.showNotifications();
  };

  render() {
    let divUser;
    if (!this.props.isLoggedIn) {
      divUser = (
        <div className="registerLogin">
          <div className="regLoginDiv">
            <Link to={LOGIN_ROUTE} className="upperLink">
              Login
            </Link>
            <a className="disabledLink">or</a>
            <Link to={REGISTER_ROUTE} className="upperLink">
              Create account
            </Link>
          </div>
        </div>
      );
    } else {
      divUser = (
        <div className="registerLogin">
          <div className="regLoginDiv">
            <a className="disabledLink">{this.props.email}</a>
            <FontAwesomeIcon
              className={
                this.props.notifications != null &&
                this.props.notifications.length > 0
                  ? "bellIconFilled"
                  : "bellIcon"
              }
              icon={faBell}
              size={"lg"}
              onClick={(e) => this.showNotifications(e)}
            />{" "}
            <Link
              to={HOME_ROUTE}
              onClick={this.props.logout}
              className="upperLink"
            >
              {" "}
              Logout
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="row navBlack">
        <div className="col-lg-2 col-sm-0"></div>
        <div className="col-lg-8 col-sm-12 col-xs-12">
          <Navbar className="upperBlack navbar-dark" expand="sm">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto firstNav">
                <div className="row firstNavRow">
                  <div>
                    <div className="socialMediaLinks">
                      <ul className="socMediaList">
                        <li className="listItem">
                          <FontAwesomeIcon
                            icon={faFacebook}
                            size={"lg"}
                            onClick={(e) =>
                              this.openWebPage(e, this.facebookLink)
                            }
                          />
                        </li>
                        <li className="listItem">
                          <FontAwesomeIcon
                            icon={faInstagramSquare}
                            size={"lg"}
                            onClick={(e) =>
                              this.openWebPage(e, this.instagramLink)
                            }
                          />
                        </li>
                        <li className="listItem">
                          <FontAwesomeIcon
                            icon={faTwitterSquare}
                            size={"lg"}
                            onClick={(e) =>
                              this.openWebPage(e, this.twitterLink)
                            }
                          />
                        </li>
                        <li className="listItem">
                          <FontAwesomeIcon
                            icon={faGooglePlus}
                            size={"lg"}
                            onClick={(e) =>
                              this.openWebPage(e, this.googleLink)
                            }
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>{divUser}</div>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div className="col-lg-2 col-sm-0"></div>
      </div>
    );
  }
}

export default NavbarBlack;
