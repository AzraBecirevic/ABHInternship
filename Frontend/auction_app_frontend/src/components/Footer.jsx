import styles from "./Footer.css";
import FooterAuction from "./FooterAuction";
import FooterGetInTouch from "./FooterGetInTouch";

import React, { Component } from "react";

export class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="footer">
        <div className="footerDiv">
          <div className="row footerRow">
            <div className="col-lg-3 col-sm-3"></div>
            <div className="col-lg-6 col-sm-6">
              {" "}
              <div className="row">
                <div className="col-lg-6 col-sm-6">
                  {" "}
                  <FooterAuction />
                </div>
                <div className="col-lg-6 col-sm-6">
                  <FooterGetInTouch openWebLink={this.props.openLink} />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-3"></div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
