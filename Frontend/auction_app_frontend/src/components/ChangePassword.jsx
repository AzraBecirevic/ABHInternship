import React, { Component } from "react";
import { PASSWORD_REGEX } from "../constants/regex";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../constants/routes";
import AuthService from "../services/authService";
import ToastService from "../services/toastService";
import Heading from "./Heading";

export class ChangePassword extends Component {
  state = {
    password: "",
    passwordErrMess: "",
    disableResetPassButton: false,
  };

  authService = new AuthService();
  toastService = new ToastService();

  componentDidMount() {
    if (localStorage.getItem("forgotPasswordEmail") == null) {
      this.toastService.showErrorToast("Please sign up or log in to continue");
      this.props.history.push(REGISTER_ROUTE);
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e) => {
    this.setState({
      emailErrMess: "",
      passwordErrMess: "",
    });

    e.preventDefault();

    if (this.validateForm()) {
      try {
        this.setState({ disableResetPassButton: true });
        this.setIsLoading(true);

        const email = localStorage.getItem("forgotPasswordEmail");
        const { password } = this.state;

        const isPasswordReset = await this.authService.changePassword(
          email,
          password,
          this.setIsLoading
        );
        if (isPasswordReset) {
          this.toastService.showSuccessToast(
            "You have successfully changed your password."
          );
          this.props.history.push(LOGIN_ROUTE);
        } else {
          this.toastService.showSuccessToast(
            "Please create account if you don't have an acconut."
          );
          this.props.history.push(REGISTER_ROUTE);
        }
      } catch (error) {
        this.toastService.showErrorToast(
          "Connection refused. Please try later."
        );
      }
    }
  };

  setIsLoading = (isLoadingValue) => {
    this.props.setIsLoading(isLoadingValue);
  };

  validatePasswordFormat(password) {
    const re = PASSWORD_REGEX;
    return re.test(String(password));
  }

  validatePassword = () => {
    const { password } = this.state;
    if (password === "") {
      this.setState({ passwordErrMess: "Password is required" });
      return false;
    }
    if (password !== "" && this.validatePasswordFormat(password) === false) {
      this.setState({
        passwordErrMess:
          "Password should be 8-16 characters long, have at least one number and one special character",
      });
      return false;
    }
    return true;
  };

  validateForm = () => {
    if (this.validatePassword() === false) {
      return false;
    }
    return true;
  };

  render() {
    const { password, passwordErrMess, disableResetPassButton } = this.state;
    return (
      <div>
        <Heading title="RESET PASSWORD"></Heading>
        <div className="loginDiv">
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              <div className="register">
                <div className="registerHeadingDiv">
                  <p className="registerHeading">RESET PASSWORD</p>
                </div>
                <div className="formDiv">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label className="formLabel">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={password}
                        onChange={this.onChange}
                      />
                      <small
                        className="errorMessage"
                        hidden={passwordErrMess === ""}
                      >
                        {passwordErrMess}
                      </small>
                    </div>

                    <button
                      disabled={disableResetPassButton}
                      type="submit"
                      className="forgPassBtn"
                    >
                      SUBMIT
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

export default ChangePassword;
