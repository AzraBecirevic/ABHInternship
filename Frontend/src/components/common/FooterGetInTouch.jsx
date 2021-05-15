import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faGooglePlus } from "@fortawesome/free-brands-svg-icons";

import React, { Component } from "react";

export class FooterGetInTouch extends Component {
  constructor(props) {
    super(props);
  }

  googleLink =
    "https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp";
  facebookLink = "https://www.facebook.com/";
  instagramLink = "https://www.instagram.com/";
  twitterLink = "https://twitter.com/";

  openWebLink = (e, link) => {
    this.props.openWebLink(e, link);
  };

  render() {
    return (
      <div className="footerTouch">
        <p className="footerInfoHeading">GET IN TOUCH</p>
        <ul className="infoList">
          <li className="infoListLi">
            <span className="infoPar">Call Us at +123 797-567-2535</span>
          </li>
          <li className="infoListLi">
            <span className="infoPar">support@auction.com</span>
          </li>
          <li className="infoListLi">
            <ul className="socMediaList">
              <li className="infoItem">
                <FontAwesomeIcon
                  icon={faFacebook}
                  size={"lg"}
                  onClick={(e) => this.openWebLink(e, this.facebookLink)}
                />
              </li>
              <li className="infoItem">
                <FontAwesomeIcon
                  icon={faInstagramSquare}
                  size={"lg"}
                  onClick={(e) => this.openWebLink(e, this.instagramLink)}
                />
              </li>
              <li className="infoItem">
                <FontAwesomeIcon
                  icon={faTwitterSquare}
                  size={"lg"}
                  onClick={(e) => this.openWebLink(e, this.twitterLink)}
                />
              </li>
              <li className="infoItem">
                <FontAwesomeIcon
                  icon={faGooglePlus}
                  size={"lg"}
                  onClick={(e) => this.openWebLink(e, this.googleLink)}
                />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default FooterGetInTouch;
