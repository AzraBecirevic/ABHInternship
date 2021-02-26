import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FORGOT_PASSWORD, HOME_ROUTE } from "../constants/routes";
import { CLOSE_TOAST_AFTER_MILISECONDS } from "../constants/toastClosing";
import AuthService from "../services/authService";
import ToastService from "../services/toastService";
import Heading from "./Heading";
import styles from "./Login.css";
export class Login extends Component {
  constructor(props) {
    super(props);
  }

  toastService = new ToastService();

  state = {
    email: "",
    password: "",
    rememberMe: false,
    emailErrMess: "",
    passwordErrMess: "",
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  validateEmail = () => {
    if (this.state.email === "") {
      this.setState({ emailErrMess: "Email is required" });
      return false;
    }
  };

  validatePassword = () => {
    if (this.state.password === "") {
      this.setState({ passwordErrMess: "Password is required" });
      return false;
    }
  };

  validateForm = () => {
    var formIsValid = true;
    if (this.validateEmail() === false) {
      formIsValid = false;
    }

    if (this.validatePassword() === false) {
      formIsValid = false;
    }

    return formIsValid;
  };

  onSubmit = (e) => {
    this.setState({
      emailErrMess: "",
      passwordErrMess: "",
    });

    e.preventDefault();

    if (this.validateForm()) {
      this.setState({ disableLoginButton: true });
      this.loginUser();
    }
  };

  loginUser = async () => {
    const auth = new AuthService();
    this.setIsLoading(true);
    var succesfullyLoggedIn = await auth.login(
      this.state.email,
      this.state.password,
      this.state.rememberMe,
      this.showErrorMessage,
      this.showSuccesMessage,
      this.setIsLoading
    );
    if (succesfullyLoggedIn) {
      var token = this.state.rememberMe
        ? localStorage.getItem("token")
        : sessionStorage.getItem("token");

      this.props.onLogin(this.state.email, token);
      this.props.history.push(HOME_ROUTE);
    }
  };

  setIsLoading = (isLoadingValue) => {
    this.props.setIsLoading(isLoadingValue);
  };

  showSuccesMessage = (successMessage) => {
    this.toastService.showSuccessToast(successMessage);
  };

  showErrorMessage = (errorMessage) => {
    this.toastService.showErrorToast(errorMessage);
    setTimeout(() => {
      this.setState({ disableLoginButton: false });
    }, CLOSE_TOAST_AFTER_MILISECONDS);
  };
  toggleCheck = () => {
    this.setState({ rememberMe: !this.state.rememberMe });
  };

  render() {
    return (
      <div>
        <div>
          <Heading title="LOGIN"></Heading>
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              <div className="register">
                <div className="registerHeadingDiv">
                  <p className="registerHeading">LOGIN</p>
                </div>
                <div className="formDiv">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label className="formLabel">Enter Email</label>
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={this.state.email}
                        onChange={this.onChange}
                      />
                      <small
                        className="errorMessage"
                        hidden={this.state.emailErrMess === ""}
                      >
                        {this.state.emailErrMess}
                      </small>
                    </div>
                    <div className="form-group">
                      <label className="formLabel">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={this.state.password}
                        onChange={this.onChange}
                      />
                      <small
                        className="errorMessage"
                        hidden={this.state.passwordErrMess === ""}
                      >
                        {this.state.passwordErrMess}
                      </small>
                    </div>
                    <div className="form-group">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={this.state.rememberMe}
                        onChange={this.toggleCheck}
                      />

                      <label className="formLabel">Remember me</label>
                    </div>
                    <button
                      disabled={this.state.disableLoginButton}
                      type="submit"
                      className="loginBtn"
                    >
                      LOGIN
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-3"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
