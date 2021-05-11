import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserPageModel from "../../model/UserPageModel";
import UserMenu from "./UserMenu";

export class UserAccountMenu extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      hideUserAccountMenu,
      closeUserAccountMenu,
      isLoggedIn,
      email,
      token,
    } = this.props;
    return (
      <div className="row myAccountMenuRow">
        <div className="col-lg-2 col-md-0 col-sm-0 "></div>
        <div className="col-lg-8 col-md-12 col-sm-12 myAccountMenuCol">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-4"></div>
            <div className="col-lg-5 col-md-4 col-sm-4 col-xs-12"></div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 menuDiv">
              {" "}
              <UserMenu
                hideUserAccountMenu={hideUserAccountMenu}
                closeUserAccountMenu={closeUserAccountMenu}
                isLoggedIn={isLoggedIn}
                email={email}
                token={token}
              ></UserMenu>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-0 col-sm-0 "></div>
      </div>
    );
  }
}

export default UserAccountMenu;
