import React, { Component } from "react";
import {
  CONNECTION_REFUSED_MESSAGE,
  FAILED_PASSWORD_CHANGE_MESSAGE,
  FORBIDDEN_PASSWORD_CHANGE_MESSAGE,
  PASSWORD_FORMAT_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
  SUCCESSFUL_PASSWORD_CHANGE_MESSAGE,
} from "../constants/messages";
import { PASSWORD_REGEX } from "../constants/regex";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../constants/routes";
import { FORGOT_PASSWORD_EMAIL } from "../constants/storage";
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
      this.toastService.showErrorToast(FORBIDDEN_PASSWORD_CHANGE_MESSAGE);
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

        const email = localStorage.getItem(FORGOT_PASSWORD_EMAIL);
        const { password } = this.state;

        const isPasswordReset = await this.authService.changePassword(
          email,
          password,
          this.setIsLoading
        );
        if (isPasswordReset) {
          this.toastService.showSuccessToast(
            SUCCESSFUL_PASSWORD_CHANGE_MESSAGE
          );
          this.props.history.push(LOGIN_ROUTE);
        } else {
          this.toastService.showErrorToast(FAILED_PASSWORD_CHANGE_MESSAGE);
          this.props.history.push(REGISTER_ROUTE);
        }
      } catch (error) {
        this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
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
      this.setState({ passwordErrMess: PASSWORD_REQUIRED_MESSAGE });
      return false;
    }
    if (password !== "" && this.validatePasswordFormat(password) === false) {
      this.setState({
        passwordErrMess: PASSWORD_FORMAT_MESSAGE,
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
