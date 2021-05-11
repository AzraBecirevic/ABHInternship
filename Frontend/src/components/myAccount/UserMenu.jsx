import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ACCESS_ACOUNT_PAGE } from "../../constants/messages";
import { CATEGORIES_ROUTE, USER_PAGE_ROUTE } from "../../constants/routes";
import UserPageModel from "../../model/UserPageModel";

export class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeUserAccountMenu();
    }
  }
  closeDiv = () => {
    this.props.closeUserAccountMenu();
  };

  userPageModel = new UserPageModel();
  render() {
    const { hideUserAccountMenu, isLoggedIn, email, token } = this.props;
    return (
      <div
        ref={this.setWrapperRef}
        hidden={hideUserAccountMenu}
        className="myAccountMenu"
        onMouseLeave={this.closeDiv}
      >
        {isLoggedIn &&
          this.userPageModel.UserPageTabs.map(
            function (userPageTab, index) {
              return (
                <div key={index} className="myAccountMenuItem">
                  <Link
                    to={{
                      pathname: USER_PAGE_ROUTE.replace(
                        ":tab",
                        userPageTab.tabName
                      ),
                      state: {
                        isLoggedIn: isLoggedIn,
                        email: email,
                        token: token,
                      },
                    }}
                    className="myAccountMenuItemLink"
                  >
                    {userPageTab.tabMenuName}
                  </Link>
                </div>
              );
            }.bind(this)
          )}
        {!isLoggedIn && (
          <div className="myAccountMenuLoginMessage">{ACCESS_ACOUNT_PAGE}</div>
        )}
      </div>
    );
  }
}

export default UserMenu;
