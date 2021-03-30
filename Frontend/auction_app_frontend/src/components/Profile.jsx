import React, { Component } from "react";
import { MIN_AGE } from "../constants/userData";

import CustomerService from "../services/customerService";
import GenderService from "../services/genderService";
import styles from "./Profile.css";
import userImage from "../assets/userImage.png";
import ValidationService from "../services/validationService";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  CONNECTION_REFUSED_MESSAGE,
  EMAIL_FORMAT_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
  PHONE_NUMBER_FORMAT_MESSAGE,
  PHONE_NUMBER_REQUIRED_MESSAGE,
} from "../constants/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ToastService from "../services/toastService";
import AuthService from "../services/authService";
import { LOGIN_ROUTE } from "../constants/routes";

export class Profile extends Component {
  state = {
    firstName: "",
    lastName: "",
    firstNameErrMess: "",
    lastNameErrMess: "",
    genderId: 0,
    genderList: null,
    dateOfBirth: null,
    dateOfBirthErrMess: "",
    dateDay: 0,
    dateMonth: "",
    dateYear: 0,
    phoneNumber: "",
    phoneNumberErrMess: "",
    email: "",
    emailErrMess: "",
    profileImage: null,
    chosenImage: null,
    imgFile: null,
  };

  customerService = new CustomerService();
  genderService = new GenderService();
  validationService = new ValidationService();
  toastService = new ToastService();
  authService = new AuthService();

  days = [];

  months = [
    { number: 1, name: "January" },
    { number: 2, name: "February" },
    { number: 3, name: "Mart" },
    { number: 4, name: "April" },
    { number: 5, name: "May" },
    { number: 6, name: "June" },
    { number: 7, name: "July" },
    { number: 8, name: "August" },
    { number: 9, name: "September" },
    { number: 10, name: "October" },
    { number: 11, name: "November" },
    { number: 12, name: "December" },
  ];
  years = [];

  fillDays = (monthNumber, year) => {
    this.days = [];
    var maxDays = 0;
    if (
      monthNumber == 1 ||
      monthNumber == 3 ||
      monthNumber == 5 ||
      monthNumber == 7 ||
      monthNumber == 8 ||
      monthNumber == 10 ||
      monthNumber == 12
    ) {
      maxDays = 31;
    } else if (
      monthNumber == 4 ||
      monthNumber == 6 ||
      monthNumber == 9 ||
      monthNumber == 11
    ) {
      maxDays = 30;
    } else {
      maxDays = 28;
      if (year !== undefined && year !== null) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          maxDays = 29;
        }
      }
    }
    for (let i = 1; i <= maxDays; i++) {
      this.days.push(i);
    }
  };

  fillYears = () => {
    var currentYear = new Date().getFullYear();
    for (let i = 1900; i <= currentYear - MIN_AGE; i++) {
      this.years.push(i);
    }
  };

  componentDidMount = async () => {
    try {
      const { token, userEmail } = this.props;
      const customer = await this.customerService.getCustomerInfoData(
        userEmail,
        token
      );

      var genders = await this.genderService.getGenders(token);

      this.fillDays(customer.birthDay, customer.birthYear);
      this.fillYears();

      this.setState({
        genderList: genders,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        genderId: customer.genderId,
        dateOfBirth: customer.dateOfBirth,
        dateDay: customer.birthDay,
        dateMonth: customer.birthMonth,
        dateYear: customer.birthYear,
        phoneNumber: customer.phoneNumber,
        profileImage: customer.profileImage,
        chosenImage: userImage,
        imgFile: null,
      });
    } catch (error) {
      this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
    }
  };

  onChange = (e) => {
    if (e.target.name == "dateMonth") {
      this.fillDays(e.target.value);
    }
    if (e.target.name == "dateYear") {
      this.fillDays(this.state.dateMonth, e.target.value);
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  validateFirstName = () => {
    if (
      this.validationService.validateFirstName(this.state.firstName) == false
    ) {
      this.setState({ firstNameErrMess: FIRST_NAME_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateLastName = () => {
    if (this.validationService.validateLastName(this.state.lastName) == false) {
      this.setState({ lastNameErrMess: LAST_NAME_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateEmail = () => {
    if (this.validationService.validateEmail(this.state.email) == false) {
      this.setState({ emailErrMess: EMAIL_REQUIRED_MESSAGE });
      return false;
    }
    if (this.validationService.validateEmailFormat(this.state.email) == false) {
      this.setState({
        emailErrMess: EMAIL_FORMAT_MESSAGE,
      });
      return false;
    }
    return true;
  };

  validatePhone = () => {
    if (this.validationService.validatePhone(this.state.phoneNumber) == false) {
      this.setState({ phoneNumberErrMess: PHONE_NUMBER_REQUIRED_MESSAGE });
      return false;
    }
    if (
      this.validationService.validatePhoneFormat(this.state.phoneNumber) ==
      false
    ) {
      this.setState({
        phoneNumberErrMess: PHONE_NUMBER_FORMAT_MESSAGE,
      });
      return false;
    }
    return true;
  };

  validateData = () => {
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

    if (this.validatePhone() === false) {
      formIsValid = false;
    }

    return formIsValid;
  };

  saveInfo = async () => {
    this.setState({
      firstNameErrMess: "",
      lastNameErrMess: "",
      emailErrMess: "",
      dateOfBirthErrMess: "",
      phoneNumberErrMess: "",
    });

    if (this.validateData()) {
      try {
        const { token, userEmail } = this.props;
        const {
          firstName,
          lastName,
          genderId,
          phoneNumber,
          email,
          dateDay,
          dateMonth,
          dateYear,
          imgFile,
          chosenImage,
          profileImage,
        } = this.state;

        if (chosenImage !== userImage && profileImage == null) {
          await this.customerService.upadateCustomerPhoto(
            userEmail,
            token,
            imgFile,
            this.showErrorMessage,
            this.showSuccesMessage
          );
        }

        var customer = await this.customerService.updateCustomer(
          userEmail,
          token,
          firstName,
          lastName,
          email,
          genderId,
          phoneNumber,
          dateDay,
          dateMonth,
          dateYear,
          imgFile,
          this.showSuccesMessage,
          this.showErrorMessage
        );

        if (customer != null && userEmail !== email) {
          this.toastService.showSuccessToast();
          this.authService.logout();
          this.props.history.push(LOGIN_ROUTE);
        }
      } catch (error) {
        this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
      }
    }
  };

  showSuccesMessage = (successMessage) => {
    this.toastService.showSuccessToast(successMessage);
  };

  showErrorMessage = (errorMessage) => {
    this.toastService.showErrorToast(errorMessage);
  };

  uploadPhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];

      this.setState({
        imgFile: img,
        profileImage: null,
        chosenImage: URL.createObjectURL(img),
      });
    }
  };
  render() {
    const {
      firstName,
      lastName,
      firstNameErrMess,
      lastNameErrMess,
      genderList,
      genderId,
      phoneNumber,
      phoneNumberErrMess,
      email,
      emailErrMess,
      profileImage,
      chosenImage,
    } = this.state;

    return (
      <div className="profileDiv">
        <div className="userInfoDiv">
          <div className="userInfoDivHeading">REQUIRED</div>
          <div className="row userInfoRow">
            <div className="col-lg-3 profileImageDiv">
              {profileImage != null && (
                <img
                  className="profileImage"
                  src={`data:image/png;base64, ${profileImage}`}
                />
              )}
              {profileImage == null && (
                <img className="profileImage" src={chosenImage} />
              )}
              <label className="userChangeImgBtn">
                {" "}
                <input
                  hidden={true}
                  name="profileImage"
                  type="file"
                  onChange={this.uploadPhoto}
                />
                CHANGE PHOTO
              </label>
            </div>
            <div className="col-lg-7 profileDataDiv">
              <form onSubmit={this.onSubmit}>
                <div className="formDataGroup">
                  <label className="formLabel">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={firstName}
                    onChange={this.onChange}
                  />
                  <small
                    className="errorMessage"
                    hidden={firstNameErrMess === ""}
                  >
                    {firstNameErrMess}
                  </small>
                </div>
                <div className="formDataGroup">
                  <label className="formLabel">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={lastName}
                    onChange={this.onChange}
                  />
                  <small
                    className="errorMessage"
                    hidden={lastNameErrMess === ""}
                  >
                    {lastNameErrMess}
                  </small>
                </div>
                <div className="formDataGroup">
                  <label className="formLabel">I am</label>

                  <select
                    className="form-control selectGenderDiv selectData"
                    name="genderId"
                    value={genderId}
                    onChange={this.onChange}
                  >
                    {genderList !== null &&
                      genderList.map(function (gender, index) {
                        return (
                          <option value={gender.id} key={index}>
                            {gender.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="formDataGroup">
                  <label className="formLabel">Date of birth</label>
                  <div style={{ display: "flex" }}>
                    <select
                      name="dateMonth"
                      className="form-control selectMonthYearDiv selectData"
                      value={this.state.dateMonth}
                      onChange={this.onChange}
                    >
                      {" "}
                      {this.months.map(function (dateMonth, index) {
                        return (
                          <option value={dateMonth.number} key={index}>
                            {dateMonth.name}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      className="form-control selectDayDiv selectData"
                      name="dateDay"
                      value={this.state.dateDay}
                      onChange={this.onChange}
                    >
                      {this.days.map(function (dateDay, index) {
                        return (
                          <option value={dateDay} key={index}>
                            {dateDay}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      className="form-control selectMonthYearDiv selectData"
                      name="dateYear"
                      value={this.state.dateYear}
                      onChange={this.onChange}
                    >
                      {this.years.map(function (dateYear, index) {
                        return (
                          <option value={dateYear} key={index}>
                            {dateYear}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <small
                    className="errorMessage"
                    hidden={this.state.dateOfBirthErrMess === ""}
                  >
                    {this.state.dateOfBirthErrMess}
                  </small>
                </div>
                <div className="formDataGroup">
                  <label className="formLabel">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={phoneNumber}
                    onChange={this.onChange}
                  />
                  <small
                    className="errorMessage"
                    hidden={phoneNumberErrMess === ""}
                  >
                    {phoneNumberErrMess}
                  </small>
                </div>
                <div className="formDataGroup">
                  <label className="formLabel">Email Adress</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={this.onChange}
                  />
                  <small className="errorMessage" hidden={emailErrMess === ""}>
                    {emailErrMess}
                  </small>
                </div>
              </form>
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>
        <div className="userInfoDiv">
          <div className="userInfoDivHeading">CARD INFORMATION</div>
        </div>
        <div className="userInfoDiv">
          <div className="userInfoDivHeading">OPTIONAL</div>
          <div className="row userInfoRow">
            <div className="col-lg-3 profileImageDiv"></div>
            <div className="col-lg-7 profileDataDiv">
              <div className="formDataGroup">
                <label className="formLabel">Country</label>
              </div>
            </div>
            <div className="col-lg-2 profileDataDiv"></div>
          </div>
        </div>
        <div className="saveInfoFormDiv">
          {" "}
          <button className="saveInfoFormBtn" onClick={this.saveInfo}>
            SAVE INFO{" "}
            <FontAwesomeIcon
              icon={faChevronRight}
              size={"sm"}
            ></FontAwesomeIcon>
          </button>
        </div>
      </div>
    );
  }
}

export default Profile;
