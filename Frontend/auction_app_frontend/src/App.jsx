import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
  CATEGORIES_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  NOT_FOUND_ROUTE,
  PRIVACY_POLICY_ROUTE,
  REGISTER_ROUTE,
  SINGLE_PRODUCT_ROUTE,
  TEARMS_CONDITIONS_ROUTE,
  CATEGORIES_ROUTE_CATEGORIES,
  CATEGORIES_ROUTE_SUBCATEGORIES,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER,
  CATEGORIES_ROUTE_PRICE_FILTER,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER,
  CATEGORIES_ROUTE_PRODUCT_NAME,
  CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME,
  CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME,
  CATEGORIES_ROUTE_CATEGORIES_SORT,
  CATEGORIES_ROUTE_SUBCATEGORIES_SORT,
  CATEGORIES_ROUTE_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_SORT,
  CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_SORT,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_SORT,
  CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_SORT,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT,
  CATEGORIES_ROUTE_CATEGORIES_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_VIEW,
  CATEGORIES_ROUTE_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_VIEW,
  CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SORT_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_SORT_VIEW,
  CATEGORIES_ROUTE_PRODUCT_NAME_SORT_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_SORT_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME_SORT_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME_SORT_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_SORT_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_SORT_VIEW,
  CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_SORT_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW,
  CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME_SORT_VIEW,
  CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW,
  USER_PAGE_ROUTE,
  CATEGORIES_ROUTE_SORT,
  CATEGORIES_ROUTE_VIEW,
  CATEGORIES_ROUTE_PRICE_FILTER_SORT,
  CATEGORIES_ROUTE_PRICE_FILTER_VIEW,
  CATEGORIES_ROUTE_SORT_VIEW,
  CATEGORIES_ROUTE_PRICE_FILTER_SORT_VIEW,
  ADD_ITEM_ROUTE,
} from "./constants/routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CLOSE_TOAST_AFTER_MILISECONDS } from "./constants/toastClosing";
import Login from "./components/Login";
import LoadingSpinner from "./components/LoadingSpinner";
import jwtDecoder from "jwt-decode";
import ToastService from "./services/toastService";
import AuthService from "./services/authService";
import Categories from "./components/Categories";
import SingleProduct from "./components/SingleProduct";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import NotFound from "./components/NotFound";
import { TOKEN, EMAIL } from "./constants/auth";
import UserPage from "./components/UserPage";
import Sell from "./components/Sell";
import Settings from "./components/Settings";
import { ADD_ITEM } from "./constants/messages";
import AddItem from "./components/AddItem";

export class App extends Component {
  state = {
    isLoggedIn: false,
    isLoading: false,
  };

  jwtToken = "";
  email = "";

  toastService = new ToastService();
  authService = new AuthService();

  componentDidMount() {
    var email;
    var token;

    if (localStorage.getItem(TOKEN) != null) {
      email = localStorage.getItem(EMAIL);
      token = localStorage.getItem(TOKEN);

      var decodedJWT = jwtDecoder(localStorage.getItem(TOKEN));
      var exp = decodedJWT.exp;

      var currentDate = new Date();
      var expirationDate = new Date(exp * 1000);

      if (currentDate > expirationDate) {
        this.toastService.showInfoToast(
          "Your session has expired. Please login again."
        );
      }
    }
    if (sessionStorage.getItem(TOKEN) != null) {
      email = sessionStorage.getItem(EMAIL);
      token = sessionStorage.getItem(TOKEN);
    }
    if (email != null && token != null) {
      this.loginCustomer(email, token);
    }
  }

  loginCustomer = (email, JWT) => {
    this.email = email;
    this.jwtToken = JWT;
    this.setState({ isLoggedIn: true });
  };

  logoutCustomer = () => {
    try {
      this.authService.logout();
      this.email = "";
      this.jwtToken = "";
      this.setState({ isLoggedIn: false });
      this.toastService.showSuccessToast("You have successfully log out.");
    } catch (err) {
      this.toastService.showErrorToast(
        "It is not possible to log you out now. Please try later."
      );
    }
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
              <Route
                path=""
                render={(props) => (
                  <Header
                    {...props}
                    openMe={this.openPage}
                    isLoggedIn={this.state.isLoggedIn}
                    email={this.email}
                    logout={this.logoutCustomer}
                    token={this.jwtToken}
                  />
                )}
              />

              <div className="containerDiv">
                <Route
                  exact
                  path={HOME_ROUTE}
                  render={(props) => (
                    <Home
                      {...props}
                      isLoggedIn={this.state.isLoggedIn}
                      email={this.email}
                      token={this.jwtToken}
                      setIsLoading={this.setIsLoading}
                    />
                  )}
                />
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
                <Switch>
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_SORT_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_SORT
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRICE_FILTER
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME_SORT_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME_SORT
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_PRODUCT_NAME
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_SUBCATEGORIES}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={
                      CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_PRODUCT_NAME
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME_SORT
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={
                      CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME_VIEW
                    }
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_PRODUCT_NAME}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRICE_FILTER}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRICE_FILTER}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_PRODUCT_NAME}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_PRODUCT_NAME}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRODUCT_NAME_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRODUCT_NAME_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRODUCT_NAME_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_CATEGORIES}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SUBCATEGORIES}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER_PRODUCT_NAME}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />

                  <Route
                    path={CATEGORIES_ROUTE_SORT_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_VIEW}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_SORT}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRICE_FILTER}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE_PRODUCT_NAME}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                  <Route
                    path={CATEGORIES_ROUTE}
                    render={(props) => (
                      <Categories {...props} setIsLoading={this.setIsLoading} />
                    )}
                  />
                </Switch>
                <Route
                  exact
                  path={SINGLE_PRODUCT_ROUTE}
                  render={(props) => (
                    <SingleProduct
                      {...props}
                      setIsLoading={this.setIsLoading}
                    />
                  )}
                />
                <Route
                  path={FORGOT_PASSWORD_ROUTE}
                  render={(props) => (
                    <ForgotPassword
                      {...props}
                      setIsLoading={this.setIsLoading}
                    />
                  )}
                />
                <Route
                  path={CHANGE_PASSWORD_ROUTE}
                  render={(props) => (
                    <ChangePassword
                      {...props}
                      setIsLoading={this.setIsLoading}
                    />
                  )}
                />
                <Route
                  path={USER_PAGE_ROUTE}
                  render={(props) => (
                    <UserPage
                      {...props}
                      setIsLoading={this.setIsLoading}
                      logoutCustomer={this.logoutCustomer}
                    />
                  )}
                />

                <Route
                  path={ADD_ITEM_ROUTE}
                  render={(props) => <AddItem {...props} />}
                />
                <Route path={NOT_FOUND_ROUTE} component={NotFound} />
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
