import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Heading from "../common/Heading";
import styles from "./Register.css";
import { withRouter } from "react-router-dom";
import AuthService from "../../services/authService";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../constants/regex";
import ToastService from "../../services/toastService";
import "react-toastify/dist/ReactToastify.css";
import { CLOSE_TOAST_AFTER_MILISECONDS } from "../../constants/toastClosing";
import { LOGIN_ROUTE } from "../../constants/routes";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  EMAIL_FORMAT_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
  PASSWORD_FORMAT_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from "../../constants/messages";
import ValidationService from "../../services/validationService";

export class Register extends Component {
  constructor(props) {
    super(props);
  }
  toastService = new ToastService();
  validationService = new ValidationService();

  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    firstNameErrMess: "",
    lastNameErrMess: "",
    emailErrMess: "",
    passwordErrMess: "",
    token: "",
    disableRegisterButton: false,
  };

  validateFirstName = () => {
    const { firstName } = this.state;
    if (!this.validationService.validateRequiredFiled(firstName)) {
      this.setState({ firstNameErrMess: FIRST_NAME_REQUIRED_MESSAGE });
      return false;
    }
    this.setState({ firstNameErrMess: "" });
    return true;
  };

  validateLastName = () => {
    const { lastName } = this.state;
    if (!this.validationService.validateRequiredFiled(lastName)) {
      this.setState({ lastNameErrMess: LAST_NAME_REQUIRED_MESSAGE });
      return false;
    }
    this.setState({ lastNameErrMess: "" });
    return true;
  };

  validateEmail = () => {
    const { email } = this.state;
    if (!this.validationService.validateRequiredFiled(email)) {
      this.setState({ emailErrMess: EMAIL_REQUIRED_MESSAGE });
      return false;
    }
    if (!this.validationService.validateEmailFormat(email)) {
      this.setState({ emailErrMess: EMAIL_FORMAT_MESSAGE });
      return false;
    }
    this.setState({ emailErrMess: "" });
    return true;
  };

  validatePassword = () => {
    const { password } = this.state;
    if (!this.validationService.validateRequiredFiled(password)) {
      this.setState({ passwordErrMess: PASSWORD_REQUIRED_MESSAGE });
      return false;
    }
    if (!this.validationService.validatePasswordFormat(password)) {
      this.setState({ passwordErrMess: PASSWORD_FORMAT_MESSAGE });
      return false;
    }
    this.setState({ passwordErrMess: "" });
    return true;
  };

  onChange = async (e) => {
    await this.setState({ [e.target.name]: e.target.value });
    this.validateTargetName(e.target.name);
  };

  validateTargetName = (targetName) => {
    switch (targetName) {
      case "firstName":
        this.validateFirstName();
        break;
      case "lastName":
        this.validateLastName();
        break;
      case "email":
        this.validateEmail();
        break;
      case "password":
        this.validatePassword();
        break;
      default:
        break;
    }
  };

  validateForm = () => {
    var formIsValid = true;

    if (this.validateFirstName() === false) {
      formIsValid = false;
    }

    if (this.validateLastName() === false) {
      formIsValid = false;
    }

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
      firstNameErrMess: "",
      lastNameErrMess: "",
      emailErrMess: "",
      passwordErrMess: "",
    });

    e.preventDefault();

    if (this.validateForm()) {
      this.setState({ disableRegisterButton: true });
      this.registerUser();
    }
  };

  registerUser = async () => {
    this.setIsLoading(true);
    const auth = new AuthService();
    var succesfullySingedUp = await auth.registerUser(
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.password,
      this.showErrorMessage,
      this.showSuccesMessage,
      this.setIsLoading
    );
    if (succesfullySingedUp) {
      this.props.history.push(LOGIN_ROUTE);
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
      this.setState({ disableRegisterButton: false });
    }, CLOSE_TOAST_AFTER_MILISECONDS);
  };

  render() {
    return (
      <div>
        <Heading title="REGISTER"></Heading>
        {this.state.isLoading && <LoadingSpinner></LoadingSpinner>}
        <div className="registerDiv">
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              <div className="register">
                <div className="registerHeadingDiv">
                  <p className="registerHeading">REGISTER</p>
                </div>
                <div className="formDiv">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label className="formLabel">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={this.state.firstName}
                        onChange={this.onChange}
                      />
                      <small
                        className="errorMessage"
                        hidden={this.state.firstNameErrMess === ""}
                      >
                        {this.state.firstNameErrMess}
                      </small>
                    </div>
                    <div className="form-group">
                      <label className="formLabel">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={this.state.lastName}
                        onChange={this.onChange}
                      />
                      <small
                        className="errorMessage"
                        hidden={this.state.lastNameErrMess === ""}
                      >
                        {this.state.lastNameErrMess}
                      </small>
                    </div>
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
                    <button
                      disabled={this.state.disableRegisterButton}
                      type="submit"
                      className="block"
                    >
                      REGISTER
                    </button>
                  </form>
                  <p className="formMessage">
                    Already have an account?{" "}
                    <Link className="formLoginLink" to={LOGIN_ROUTE}>
                      Login
                    </Link>
                  </p>
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

export default withRouter(Register);
