import { Nav, Navbar } from "react-bootstrap";
import NavbarBlack from "./NavbarBlack";
import NavbarWhite from "./NavbarWhite";

import React, { Component } from "react";
import { Route } from "react-router";

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
        <Route
          path=""
          render={(props) => (
            <NavbarWhite
              {...props}
              isLoggedIn={this.props.isLoggedIn}
              email={this.props.email}
              token={this.props.token}
            />
          )}
        />
      </div>
    );
  }
}

export default Header;
