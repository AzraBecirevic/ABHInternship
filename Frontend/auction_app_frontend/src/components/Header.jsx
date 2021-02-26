import { Nav, Navbar } from "react-bootstrap";
import styles from "./Header.css";
import NavbarBlack from "./NavbarBlack";
import NavbarWhite from "./NavbarWhite";

import React, { Component } from "react";

export class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <NavbarBlack
          openWebPage={this.props.openMe}
          isLoggedIn={this.props.isLoggedIn}
          email={this.props.email}
          logout={this.props.logout}
        ></NavbarBlack>
        <NavbarWhite></NavbarWhite>
      </div>
    );
  }
}

export default Header;
