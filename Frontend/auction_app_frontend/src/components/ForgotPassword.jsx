import React, { Component } from "react";
import { EMAIL_FORMAT_MESSAGE } from "../constants/messages";
import { EMAIL_REGEX } from "../constants/regex";
import { REGISTER_ROUTE } from "../constants/routes";
import { CLOSE_TOAST_AFTER_MILISECONDS } from "../constants/toastClosing";
import AuthService from "../services/authService";
import ToastService from "../services/toastService";
import Heading from "./Heading";

export class ForgotPassword extends Component {
  state = {
    email: "",
    emailErrMess: "",
    disableForgotButton: false,
  };

  authService = new AuthService();
  toastService = new ToastService();

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e) => {
    this.setState({
      emailErrMess: "",
    });

    e.preventDefault();

    if (this.validateForm()) {
      const { email } = this.state;

      try {
        this.setState({ disableForgotButton: true });
        this.setIsLoading(true);
        const isEmailSent = await this.authService.forgotPassword(
          email,
          this.setIsLoading
        );

        if (isEmailSent) {
          this.showSuccessMessage(
            "We have successfully sent a password reset link to your email address"
          );
        } else {
          this.showErrorMessage(
            "There is no user associated with this account."
          );
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

  showErrorMessage = (errorMessage) => {
    this.toastService.showErrorToast(errorMessage);
    setTimeout(() => {
      this.setState({ disableForgotButton: false });
    }, CLOSE_TOAST_AFTER_MILISECONDS);
  };

  showSuccessMessage = (succesMessage) => {
    this.toastService.showSuccessToast(succesMessage);
    setTimeout(() => {
      this.setState({ disableForgotButton: false });
    }, CLOSE_TOAST_AFTER_MILISECONDS);
  };

  validateEmailFormat(email) {
    const re = EMAIL_REGEX;
    return re.test(String(email).toLowerCase());
  }

  validateEmail = () => {
    const { email } = this.state;

    if (email === "") {
      this.setState({ emailErrMess: "Email is required" });
      return false;
    }
    if (email !== "" && this.validateEmailFormat(email) === false) {
      this.setState({
        emailErrMess: EMAIL_FORMAT_MESSAGE,
      });
      return false;
    }
    return true;
  };

  validateForm = () => {
    if (this.validateEmail() === false) {
      return false;
    }
    return true;
  };

  render() {
    const { email, emailErrMess, disableForgotButton } = this.state;
    return (
      <div>
        <Heading title="FORGOT PASSWORD"></Heading>
        <div className="loginDiv">
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              <div className="register">
                <div className="registerHeadingDiv">
                  <p className="registerHeading">FORGOT PASSWORD</p>
                </div>
                <div className="forggotPasswordDiv">
                  <div className="forgotPassMessage">
                    Lost your password? Please enter your username or email
                    address. You will receive a link to create a new password
                    via email.
                  </div>
                </div>
                <div className="formDivForgotPass">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label className="formLabel">Enter Email</label>
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={email}
                        onChange={this.onChange}
                      />
                      <small
                        className="errorMessage"
                        hidden={emailErrMess === ""}
                      >
                        {emailErrMess}
                      </small>
                    </div>

                    <button
                      disabled={disableForgotButton}
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

export default ForgotPassword;
