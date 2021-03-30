import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { EMAIL, TOKEN } from "../constants/auth";
import { ACCESS_ACOUNT_PAGE, ACCOUNT_PAGE_TITLE } from "../constants/messages";
import UserPageModel from "../model/UserPageModel";
import Heading from "./Heading";
import styles from "./UserPage.css";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGavel } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { USER_PAGE_ROUTE, USER_PAGE_ROUTE_TAB } from "../constants/routes";
import Profile from "./Profile";
import { Route } from "react-router";

export class UserPage extends Component {
  state = {
    showLoginDiv: false,
    email: "",
    token: "",
    tabToShow: "",
  };

  userPageModel = new UserPageModel();

  checkStorageLoginData() {
    if (localStorage.getItem(TOKEN) != null) {
      return true;
    } else if (sessionStorage.getItem(TOKEN) != null) {
      return true;
    }
    return false;
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.match.params.tab != this.props.match.params.tab) {
      this.loadData();
    }
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    if (
      (this.props.location.state != undefined &&
        this.props.location.state.isLoggedIn == false) ||
      this.checkStorageLoginData() == false
    ) {
      this.setState({ showLoginDiv: true });
      return;
    }
    var email;
    var token;
    var showTab = "";
    if (this.props.location.state !== undefined) {
      email = this.props.location.state.email;
      token = this.props.location.state.token;
    } else {
      if (localStorage.getItem(TOKEN) !== null) {
        email = localStorage.getItem(EMAIL);
        token = localStorage.getItem(TOKEN);
      } else if (sessionStorage.getItem(TOKEN) != null) {
        email = sessionStorage.getItem(EMAIL);
        token = sessionStorage.getItem(TOKEN);
      }
    }

    var pathTabParam = this.props.match.params.tab;
    if (
      pathTabParam !== undefined &&
      pathTabParam !== ":tab" &&
      pathTabParam !== ""
    ) {
      showTab = pathTabParam;
    }

    this.setState({ email: email, token: token, tabToShow: showTab });
  };

  findTabIcon(tabName) {
    switch (tabName) {
      case "Profile":
        return faUserAlt;
      case "Seller":
        return faList;
      case "Bids":
        return faGavel;
      case "Settings":
        return faCog;
    }
  }

  chosenTab(tabName) {
    this.props.history.push({
      pathname: USER_PAGE_ROUTE.replace(":tab", tabName),
    });
  }

  render() {
    const { showLoginDiv, tabToShow, email, token } = this.state;
    return (
      <div>
        {showLoginDiv && (
          <div className="accesAcountPageMessageDiv">{ACCESS_ACOUNT_PAGE}</div>
        )}
        {!showLoginDiv && (
          <div>
            <Heading
              title={tabToShow.toUpperCase()}
              secondTitle={`${ACCOUNT_PAGE_TITLE} / ${tabToShow}`.toUpperCase()}
            ></Heading>

            <div className="row userAccountPageRow">
              <div className="col-lg-2"></div>
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="tabsDiv">
                      {this.userPageModel.UserPageTabs.map(
                        function (userPageTab, index) {
                          return (
                            <div
                              key={index}
                              className={
                                tabToShow == userPageTab.tabName
                                  ? "tabDivActive"
                                  : "tabDiv"
                              }
                              onClick={() =>
                                this.chosenTab(userPageTab.tabName)
                              }
                            >
                              <FontAwesomeIcon
                                className="tabDivIcon"
                                icon={this.findTabIcon(userPageTab.tabName)}
                                size={"lg"}
                              ></FontAwesomeIcon>
                              {userPageTab.tabName}
                            </div>
                          );
                        }.bind(this)
                      )}
                    </div>
                    <div>
                      {tabToShow == "Profile" && (
                        <Route
                          path=""
                          render={(props) => (
                            <Profile
                              {...props}
                              userEmail={email}
                              token={token}
                            />
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
              <div className="col-lg-2"></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPage;
