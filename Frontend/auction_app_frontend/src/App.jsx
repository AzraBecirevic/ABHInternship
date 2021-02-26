import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import Home from "./components/Home";
import TearmsAndConditions from "./components/TearmsAndConditions";
import PrivacyAndPolicy from "./components/PrivacyAndPolicy";
import ScrollToTop from "./components/ScrollToTop";
import Register from "./components/Register";
import React, { Component } from "react";
import {
  ABOUT_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  PRIVACY_POLICY_ROUTE,
  REGISTER_ROUTE,
  TEARMS_CONDITIONS_ROUTE,
} from "./constants/routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CLOSE_TOAST_AFTER_MILISECONDS } from "./constants/toastClosing";
import Login from "./components/Login";
import LoadingSpinner from "./components/LoadingSpinner";
import jwtDecoder from "jwt-decode";
import ToastService from "./services/toastService";

export class App extends Component {
  state = {
    isLoggedIn: false,
    isLoading: false,
  };

  jwtToken = "";
  email = "";

  toastService = new ToastService();

  componentDidMount() {
    if (sessionStorage.getItem("token") != null) {
      this.loginCustomer(
        sessionStorage.getItem("email"),
        sessionStorage.getItem("token")
      );
    }
    if (localStorage.getItem("token") !== null) {
      this.loginCustomer(
        localStorage.getItem("email"),
        localStorage.getItem("token")
      );
      var decodedJWT = jwtDecoder(localStorage.getItem("token"));
      var exp = decodedJWT.exp;

      var currentDate = new Date();
      var expirationDate = new Date(exp * 1000);

      if (currentDate > expirationDate) {
        this.logoutCustomer();
        this.toastService.showInfoToast(
          "Your session has expired. Please login again."
        );
      }
    }
  }

  loginCustomer = (email, JWT) => {
    this.email = email;
    this.jwtToken = JWT;
    this.setState({ isLoggedIn: true });
  };

  logoutCustomer = () => {
    if (localStorage.getItem("token") != null) {
      localStorage.removeItem("token");
      if (localStorage.getItem("email") != null) {
        localStorage.removeItem("email");
      }
    }

    if (sessionStorage.getItem("token") != null) {
      sessionStorage.removeItem("token");
      if (sessionStorage.getItem("email") != null) {
        sessionStorage.removeItem("email");
      }
    }
    this.email = "";
    this.jwtToken = "";

    this.setState({ isLoggedIn: false });
  };

  setIsLoading = (isLoadingValue) => {
    this.setState({ isLoading: isLoadingValue });
  };

  openPage(e, url) {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  }

  render() {
    return (
      <Router>
        <ScrollToTop>
          <ToastContainer
            position="top-right"
            autoClose={CLOSE_TOAST_AFTER_MILISECONDS}
          ></ToastContainer>
          {this.state.isLoading && <LoadingSpinner></LoadingSpinner>}
          {
            <div className="app">
              <Header
                openMe={this.openPage}
                isLoggedIn={this.state.isLoggedIn}
                email={this.email}
                logout={this.logoutCustomer}
              />
              <div className="containerDiv">
                <Route path={HOME_ROUTE} exact component={Home}></Route>
                <Route path={ABOUT_ROUTE} component={AboutUs}></Route>
                <Route
                  path={TEARMS_CONDITIONS_ROUTE}
                  component={TearmsAndConditions}
                ></Route>
                <Route
                  path={PRIVACY_POLICY_ROUTE}
                  component={PrivacyAndPolicy}
                ></Route>
                <Route
                  path={LOGIN_ROUTE}
                  render={(props) => (
                    <Login
                      {...props}
                      onLogin={this.loginCustomer}
                      setIsLoading={this.setIsLoading}
                      firstName={this.state.firstName}
                    />
                  )}
                />
                <Route
                  path={REGISTER_ROUTE}
                  render={(props) => (
                    <Register {...props} setIsLoading={this.setIsLoading} />
                  )}
                />
              </div>
              <Footer openLink={this.openPage} />
            </div>
          }
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
