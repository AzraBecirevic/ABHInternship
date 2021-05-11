import React, { Component } from "react";
import { MIN_AGE } from "../../constants/userData";

import CustomerService from "../../services/customerService";
import GenderService from "../../services/genderService";
import styles from "./Profile.css";
import userImage from "../../assets/userImage.png";
import ValidationService from "../../services/validationService";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  CARD_CVC_FORMAT_MESSAGE,
  CARD_CVC_REQUIRED_MESSAGE,
  CARD_DATA_NOT_SAVED,
  CARD_EXPIRATION_DATE_FORMAT_MESSAGE,
  CARD_EXPIRATION_DATE_REQUIRED_MESSAGE,
  CARD_INFORMATION,
  CARD_NAME_REQUIRED_MESSAGE,
  CARD_NUMBER_FORMAT_MESSAGE,
  CARD_NUMBER_REQUIRED_MESSAGE,
  CHANGE_PHOTO,
  CITY_FORMAT_MESSAGE,
  CITY_REQUIRED_MESSAGE,
  CONNECTION_REFUSED_MESSAGE,
  COUNTRY_REQUIRED_MESSAGE,
  EMAIL_FORMAT_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  GENDER_REQIURED_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
  MUST_BE_OLDER_THAN_MESSAGE,
  OPTIONAL,
  PHONE_NUMBER_FORMAT_MESSAGE,
  PHONE_NUMBER_REQUIRED_MESSAGE,
  REGION_REQUIRED_MESSAGE,
  REQUIRED,
  SAVE_INFO,
  STREET_FORMAT_MESSAGE,
  STREET_REQUIRED_MESSAGE,
  SUCCESSFUL_CUSTOMER_UPDATE_LOGIN_MESSAGE,
  SUCCESSFUL_CUSTOMER_UPDATE_MESSAGE,
  ZIP_CODE_FORMAT_MESSAGE,
  ZIP_CODE_REQUIRED_MESSAGE,
} from "../../constants/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ToastService from "../../services/toastService";
import AuthService from "../../services/authService";
import { LOGIN_ROUTE } from "../../constants/routes";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import { CLOSE_TOAST_AFTER_MILISECONDS } from "../../constants/toastClosing";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import csc from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import CardInfo from "./CardInfo";
import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeService from "../../services/stripeService";
import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";

export class Profile extends Component {
  constructor(props) {
    super(props);
  }

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
    country: "",
    region: "",
    city: "",
    zipCode: "",
    street: "",
    cityErrMess: "",
    zipCodeErrMess: "",
    streetErrMess: "",
    countryErrMess: "",
    regionErrMess: "",
    genderErrMeess: "",
    disabledSaveInfoBtn: false,
    phoneCountry: "",
    countryList: [],
    stateList: [],
    cityList: [],
    chosenCoutryCode: "",
    chosenCountryName: "",
    chosenStateCode: "",
    chosenStateName: "",
    chosenCityCode: "",
    chosenCityName: "",
    cardName: "",
    cardNameErrMess: "",
    cardNumberErrMess: "",
    cardNumberEmpty: true,
    cardExpirationDateErrMess: "",
    cardExpirationDateEmpty: true,
    cardCVCErrMess: "",
    cardCVCEmpty: true,
    elements: "",
    cardNumberCompleted: false,
    cardExpirationDateCompleted: false,
    cardCVCCompleted: false,
  };

  customerService = new CustomerService();
  genderService = new GenderService();
  validationService = new ValidationService();
  toastService = new ToastService();
  authService = new AuthService();
  stripeService = new StripeService();

  stripePromise = null;

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

  fillCardNumber = (cardNumberState, cardNumberCompletedState) => {
    this.setState({
      cardNumberEmpty: cardNumberState,
      cardNumberCompleted: cardNumberCompletedState,
    });
  };

  fillCardExpirationDate = (
    cardExpirationDateState,
    cardExpirationDateCompletedState
  ) => {
    this.setState({
      cardExpirationDateEmpty: cardExpirationDateState,
      cardExpirationDateCompleted: cardExpirationDateCompletedState,
    });
  };

  fillCardCVC = (cvcState, cvcCompletedState) => {
    this.setState({
      cardCVCEmpty: cvcState,
      cardCVCCompleted: cvcCompletedState,
    });
  };

  fillElements = (elements) => {
    this.setState({ elements: elements });
  };

  fillYears = (birthYear) => {
    if (birthYear >= new Date().getFullYear()) {
      this.years.push(birthYear);
    }

    var currentYear = new Date().getFullYear();
    for (let i = 1900; i <= currentYear - MIN_AGE; i++) {
      this.years.push(i);
    }
  };

  loadCountries() {
    var countries = [{ name: " - ", isoCode: "-" }];
    var cscCountries = csc.getAllCountries();
    var transfomedCountries = cscCountries.map(function (c) {
      return { name: c.name, isoCode: c.isoCode };
    });

    for (let i = 0; i < transfomedCountries.length; i++) {
      countries.push(transfomedCountries[i]);
    }

    return countries;
  }

  loadStatesByCode(code) {
    var states = [{ name: " - ", isoCode: "-", countryCode: "-" }];
    var cscStates = csc.getStatesOfCountry(code);
    var transfomedStates = cscStates.map(function (c) {
      return { name: c.name, isoCode: c.isoCode, countryCode: c.countryCode };
    });

    for (let i = 0; i < transfomedStates.length; i++) {
      states.push(transfomedStates[i]);
    }

    return states;
  }

  loadStates(countryName) {
    var countryCode = "";
    for (let i = 0; i < this.state.countryList.length; i++) {
      if (this.state.countryList[i].name === countryName) {
        countryCode = this.state.countryList[i].isoCode;
        break;
      }
    }
    if (countryCode !== "") {
      var states = this.loadStatesByCode(countryCode);
      this.setState({ stateList: states });
      this.setState({
        city: "",
        region: "",
        cityList: [{ name: " - ", stateCode: "-", countryCode: "-" }],
      });
    }
  }

  loadCitiesByCode(stateCode, countryCode) {
    var cities = [{ name: " - ", stateCode: "-", countryCode: "-" }];
    var cscCities = csc.getCitiesOfState(countryCode, stateCode);
    var transfomedCities = cscCities.map(function (c) {
      return {
        name: c.name,
        stateCode: c.stateCode,
        countryCode: c.countryCode,
      };
    });

    for (let i = 0; i < transfomedCities.length; i++) {
      cities.push(transfomedCities[i]);
    }

    return cities;
  }

  loadCities(stateName) {
    var countryCode = "";
    var stateCode = "";
    for (let i = 0; i < this.state.stateList.length; i++) {
      if (this.state.stateList[i].name === stateName) {
        stateCode = this.state.stateList[i].isoCode;
        countryCode = this.state.stateList[i].countryCode;
        break;
      }
    }
    if (stateCode !== "" && countryCode !== "") {
      var cities = this.loadCitiesByCode(stateCode, countryCode);
      this.setState({ cityList: cities, city: "" });
    }
  }

  componentDidMount = async () => {
    try {
      const { token, userEmail } = this.props;

      let stripePublicKey = await this.stripeService.getPublicKey(token);

      this.stripePromise = loadStripe(stripePublicKey.publicKey);

      var countries = this.loadCountries();

      this.setIsLoading(true);
      const customer = await this.customerService.getCustomerInfoData(
        userEmail,
        token
      );

      var genders = await this.genderService.getGenders(token);

      var deliveryData = await this.customerService.getCustomerDeliveryData(
        userEmail,
        token
      );

      if (customer != null) {
        this.fillDays(customer.birthMonth, customer.birthYear);
        this.fillYears(customer.birthYear);
        this.setState({
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
        });
      }

      this.setState({
        genderList: genders,
        chosenImage: userImage,
        imgFile: null,
        countryList: countries,
      });
      var states;
      var cities;

      if (deliveryData !== null) {
        if (deliveryData.country !== null && deliveryData.country.length > 0) {
          states = this.loadStates(deliveryData.country);
        }
        if (deliveryData.region !== null && deliveryData.region.length > 0) {
          cities = this.loadCities(deliveryData.region);
        }
        this.setState({
          country: deliveryData.country,
          region: deliveryData.region,
          city: deliveryData.city,
          zipCode: deliveryData.zipCode,
          street: deliveryData.street,
        });
      }
      this.setIsLoading(false);
    } catch (error) {
      this.setIsLoading(false);
      this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
    }
  };

  onChange = (e) => {
    if (e.target.name == "dateMonth") {
      this.fillDays(e.target.value, this.state.dateYear);
    } else if (e.target.name == "dateYear") {
      this.fillDays(this.state.dateMonth, e.target.value);
    } else if (e.target.name == "country") {
      this.loadStates(e.target.value);
    } else if (e.target.name == "region") {
      this.loadCities(e.target.value);
    }

    this.setState({ [e.target.name]: e.target.value });
  };

  validateFirstName = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.firstName) ==
      false
    ) {
      this.setState({ firstNameErrMess: FIRST_NAME_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateLastName = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.lastName) == false
    ) {
      this.setState({ lastNameErrMess: LAST_NAME_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateEmail = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.email) == false
    ) {
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
    if (
      this.validationService.validateRequiredFiled(this.state.phoneNumber) ==
        false ||
      this.state.phoneNumber == undefined
    ) {
      this.setState({ phoneNumberErrMess: PHONE_NUMBER_REQUIRED_MESSAGE });
      return false;
    }
    if (
      this.state.phoneNumber != undefined &&
      this.state.phoneNumber.length > 0 &&
      isValidPhoneNumber(this.state.phoneNumber) == false
    ) {
      this.setState({
        phoneNumberErrMess: PHONE_NUMBER_FORMAT_MESSAGE,
      });
      return false;
    }

    return true;
  };

  validateGender = () => {
    if (this.state.genderId <= 0) {
      this.setState({ genderErrMeess: GENDER_REQIURED_MESSAGE });
      return false;
    }
    return true;
  };

  validateDateOfBirth = () => {
    const { dateYear } = this.state;
    if (+dateYear + MIN_AGE > new Date().getFullYear()) {
      this.setState({ dateOfBirthErrMess: MUST_BE_OLDER_THAN_MESSAGE });
      return false;
    }

    return true;
  };

  validateZipCode = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.zipCode) == false
    ) {
      this.setState({ zipCodeErrMess: ZIP_CODE_REQUIRED_MESSAGE });
      return false;
    }

    if (
      this.validationService.validateZipCodeFormat(this.state.zipCode) == false
    ) {
      this.setState({
        zipCodeErrMess: ZIP_CODE_FORMAT_MESSAGE,
      });
      return false;
    }

    return true;
  };

  validateCityConutryRegionFormat = (text) => {
    if (text === " - ") {
      return false;
    }
    return true;
  };

  validateCity = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.city) == false ||
      !this.validateCityConutryRegionFormat(this.state.city)
    ) {
      this.setState({ cityErrMess: CITY_REQUIRED_MESSAGE });
      return false;
    }

    return true;
  };

  validateCountry = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.country) ==
        false ||
      !this.validateCityConutryRegionFormat(this.state.country)
    ) {
      this.setState({ countryErrMess: COUNTRY_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateRegion = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.region) ==
        false ||
      !this.validateCityConutryRegionFormat(this.state.region)
    ) {
      this.setState({ regionErrMess: REGION_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateStreet = () => {
    if (
      this.validationService.validateRequiredFiled(this.state.street) == false
    ) {
      this.setState({ streetErrMess: STREET_REQUIRED_MESSAGE });
      return false;
    }

    if (
      this.validationService.validateStreetFormat(this.state.street) == false
    ) {
      this.setState({
        streetErrMess: STREET_FORMAT_MESSAGE,
      });
      return false;
    }

    return true;
  };

  validateDeliveryAddress() {
    var deliveryAddressFormIsValid = true;

    if (this.validateCity() === false) {
      deliveryAddressFormIsValid = false;
    }

    if (this.validateZipCode() === false) {
      deliveryAddressFormIsValid = false;
    }

    if (this.validateStreet() === false) {
      deliveryAddressFormIsValid = false;
    }

    if (this.validateCountry() == false) {
      deliveryAddressFormIsValid = false;
    }

    if (this.validateRegion() == false) {
      deliveryAddressFormIsValid = false;
    }

    return deliveryAddressFormIsValid;
  }
  isDeliveryFormChanged = () => {
    const { country, region, city, zipCode, street } = this.state;

    if (
      country.length > 0 ||
      region.length > 0 ||
      city.length > 0 ||
      zipCode.length > 0 ||
      street.length > 0
    ) {
      return true;
    }
    return false;
  };

  validateCardName = () => {
    const { cardName } = this.state;
    if (this.validationService.validateRequiredFiled(cardName) == false) {
      this.setState({ cardNameErrMess: CARD_NAME_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateCardNumber = () => {
    const { cardNumberEmpty, cardNumberCompleted } = this.state;
    if (cardNumberEmpty == true) {
      this.setState({ cardNumberErrMess: CARD_NUMBER_REQUIRED_MESSAGE });
      return false;
    }
    if (cardNumberCompleted == false) {
      this.setState({
        cardNumberErrMess: CARD_NUMBER_FORMAT_MESSAGE,
      });
      return false;
    }

    return true;
  };

  validateCardExpirationDate = () => {
    const { cardExpirationDateEmpty, cardExpirationDateCompleted } = this.state;
    if (cardExpirationDateEmpty == true) {
      this.setState({
        cardExpirationDateErrMess: CARD_EXPIRATION_DATE_REQUIRED_MESSAGE,
      });
      return false;
    }
    if (cardExpirationDateCompleted == false) {
      this.setState({
        cardExpirationDateErrMess: CARD_EXPIRATION_DATE_FORMAT_MESSAGE,
      });
      return false;
    }
    return true;
  };
  validateCardCVC = () => {
    const { cardCVCEmpty, cardCVCCompleted } = this.state;
    if (cardCVCEmpty == true) {
      this.setState({ cardCVCErrMess: CARD_CVC_REQUIRED_MESSAGE });
      return false;
    }
    if (cardCVCCompleted == false) {
      this.setState({ cardCVCErrMess: CARD_CVC_FORMAT_MESSAGE });
      return false;
    }
    return true;
  };

  validateCardForm = () => {
    let cardFormIsValid = true;

    if (this.validateCardName() === false) {
      cardFormIsValid = false;
    }
    if (this.validateCardNumber() === false) {
      cardFormIsValid = false;
    }
    if (this.validateCardExpirationDate() === false) {
      cardFormIsValid = false;
    }
    if (this.validateCardCVC() === false) {
      cardFormIsValid = false;
    }
    return cardFormIsValid;
  };

  isCardFormChanged = () => {
    const {
      cardName,
      cardNumberEmpty,
      cardExpirationDateEmpty,
      cardCVCEmpty,
    } = this.state;
    if (
      cardName !== "" ||
      cardNumberEmpty == false ||
      cardExpirationDateEmpty == false ||
      cardCVCEmpty == false
    ) {
      return true;
    }
    return false;
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

    if (this.validateGender() == false) {
      formIsValid = false;
    }

    if (this.validateDateOfBirth() == false) {
      formIsValid = false;
    }

    if (this.isDeliveryFormChanged()) {
      if (this.validateDeliveryAddress() === false) {
        formIsValid = false;
      }
    }

    if (this.isCardFormChanged()) {
      if (this.validateCardForm() === false) {
        formIsValid = false;
      }
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
      cityErrMess: "",
      zipCodeErrMess: "",
      streetErrMess: "",
      countryErrMess: "",
      regionErrMess: "",
      genderErrMeess: "",
      cardNameErrMess: "",
      cardNumberErrMess: "",
      cardExpirationDateErrMess: "",
      cardCVCErrMess: "",
    });

    if (this.validateData()) {
      try {
        this.setState({ disabledSaveInfoBtn: true });
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
          country,
          region,
          city,
          zipCode,
          street,
          cardName,
        } = this.state;

        this.setIsLoading(true);

        var showSucces = true;

        if (this.isCardFormChanged()) {
          if (!this.stripePromise) {
            return;
          }
          let setupIntent = await this.stripeService.createSetupIntent(
            userEmail,
            token
          );
          if (setupIntent !== null) {
            const result = await (await this.stripePromise).confirmCardSetup(
              setupIntent.client_secret,
              {
                payment_method: {
                  card: this.state.elements,
                  billing_details: {
                    name: cardName,
                  },
                },
              }
            );

            if (result.error) {
              showSucces = false;
              this.toastService.showErrorToast(CARD_DATA_NOT_SAVED);
            }
          }
        }

        if (showSucces && this.isDeliveryFormChanged()) {
          var deliveryData = await this.customerService.updateCustomerDeliveryData(
            userEmail,
            token,
            country,
            region,
            city,
            zipCode,
            street
          );
          if (deliveryData == null) {
            showSucces = false;
          }
        }

        if (showSucces && chosenImage !== userImage && profileImage == null) {
          var photo = await this.customerService.upadateCustomerPhoto(
            userEmail,
            token,
            imgFile
          );
          if (photo == null) {
            showSucces = false;
          }
        }

        if (showSucces) {
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
            this.showErrorMessage
          );

          if (customer == null) {
            showSucces = false;
          }
        }
        this.setState({ disabledSaveInfoBtn: false });
        this.setIsLoading(false);

        if (showSucces && userEmail !== email) {
          this.toastService.showSuccessToast(
            SUCCESSFUL_CUSTOMER_UPDATE_LOGIN_MESSAGE
          );
          this.authService.logout();
          this.props.history.push(LOGIN_ROUTE);
        } else if (showSucces) {
          this.toastService.showSuccessToast(
            SUCCESSFUL_CUSTOMER_UPDATE_MESSAGE
          );
        }
      } catch (error) {
        this.setState({ disabledSaveInfoBtn: false });
        this.setIsLoading(false);

        this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
      }
    }
  };

  setIsLoading = (isLoadingValue) => {
    this.props.setIsLoading(isLoadingValue);
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

  selectCountry(val) {
    this.setState({ country: val, region: "" });
  }

  selectRegion(val) {
    if (val == "") {
      this.setState({ country: "" });
    }
    this.setState({ region: val });
  }

  render() {
    const { userEmail, token } = this.props;
    const {
      firstName,
      lastName,
      firstNameErrMess,
      lastNameErrMess,
      genderList,
      genderId,
      genderErrMeess,
      phoneNumber,
      phoneNumberErrMess,
      email,
      emailErrMess,
      profileImage,
      chosenImage,
      country,
      region,
      city,
      zipCode,
      street,
      cityErrMess,
      zipCodeErrMess,
      streetErrMess,
      countryErrMess,
      regionErrMess,
      disabledSaveInfoBtn,
      phoneCountry,
      dateOfBirthErrMess,
      dateMonth,
      dateDay,
      dateYear,
      countryList,
      stateList,
      cityList,
      cardName,
      cardNameErrMess,
      cardNumberErrMess,
      cardExpirationDateErrMess,
      cardCVCErrMess,
    } = this.state;

    return (
      <div className="profileDiv">
        <div className="userInfoDiv">
          <div className="userInfoDivHeading">{REQUIRED}</div>
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
                {CHANGE_PHOTO}
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
                    <option value={0} defaultValue={genderId == 0}>
                      {" "}
                      -{" "}
                    </option>
                    {genderList !== null &&
                      genderList.map(function (gender, index) {
                        return (
                          <option value={gender.id} key={index}>
                            {gender.name}
                          </option>
                        );
                      })}
                  </select>
                  <small
                    className="errorMessage"
                    hidden={genderErrMeess === ""}
                  >
                    {genderErrMeess}
                  </small>
                </div>
                <div className="formDataGroup">
                  <label className="formLabel">Date of birth</label>
                  <div style={{ display: "flex" }}>
                    <select
                      name="dateMonth"
                      className="form-control selectMonthYearDiv selectData"
                      value={dateMonth}
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
                      value={dateDay}
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
                      value={dateYear}
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
                    hidden={dateOfBirthErrMess === ""}
                  >
                    {dateOfBirthErrMess}
                  </small>
                </div>
                <div className="formDataGroup">
                  <label className="formLabel">Phone Number</label>
                  <PhoneInput
                    international
                    name="phoneNumber"
                    country={this.state.phoneCountry}
                    value={phoneNumber}
                    onChange={(phoneNumber, country) =>
                      this.setState({ phoneNumber, phoneCountry })
                    }
                  ></PhoneInput>
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
          <div className="userInfoDivHeading">{CARD_INFORMATION}</div>
          <Elements stripe={this.stripePromise}>
            <ElementsConsumer>
              {({ stripe, elements }) => (
                <CardInfo
                  elements={elements}
                  email={userEmail}
                  token={token}
                  cardName={cardName}
                  cardNameErrMess={cardNameErrMess}
                  cardNumberErrMess={cardNumberErrMess}
                  cardExpirationDateErrMess={cardExpirationDateErrMess}
                  cardCVCErrMess={cardCVCErrMess}
                  onChange={this.onChange}
                  fillCardNumber={this.fillCardNumber}
                  fillCardExpirationDate={this.fillCardExpirationDate}
                  fillCardCVC={this.fillCardCVC}
                  fillElements={this.fillElements}
                ></CardInfo>
              )}
            </ElementsConsumer>
          </Elements>
        </div>
        <div className="userInfoDiv">
          <div className="userInfoDivHeading">{OPTIONAL}</div>
          <div className="row userInfoRow">
            <div className="col-lg-3 profileImageDiv"></div>
            <div className="col-lg-7 profileDataDiv">
              <div className="formDataGroup">
                <label className="formLabel">Country</label>
                <select
                  name="country"
                  value={country}
                  className="form-control selectDataDropdown"
                  onChange={this.onChange}
                >
                  {countryList != null &&
                    countryList.map(function (c, index) {
                      return (
                        <option key={index} value={c.name}>
                          {c.name}
                        </option>
                      );
                    })}
                </select>
                <small className="errorMessage" hidden={countryErrMess === ""}>
                  {countryErrMess}
                </small>
              </div>

              <div className="formDataGroup">
                <label className="formLabel">State</label>
                <select
                  name="region"
                  value={region}
                  className="form-control selectDataDropdown"
                  onChange={this.onChange}
                >
                  {stateList != null &&
                    stateList.map(function (s, index) {
                      return (
                        <option key={index} value={s.name}>
                          {s.name}
                        </option>
                      );
                    })}
                </select>
                <small className="errorMessage" hidden={regionErrMess === ""}>
                  {regionErrMess}
                </small>
              </div>

              <div className="formDataGroup"></div>

              <div className="formDataGroup">
                <div className="cityZipCodeDiv">
                  <div className="cityInput">
                    <label className="formLabel">City</label>
                    <select
                      name="city"
                      value={city}
                      className="form-control selectDataDropdown"
                      onChange={this.onChange}
                    >
                      {cityList != null &&
                        cityList.map(function (c, index) {
                          return (
                            <option key={index} value={c.name}>
                              {c.name}
                            </option>
                          );
                        })}
                    </select>
                    <small className="errorMessage" hidden={cityErrMess === ""}>
                      {cityErrMess}
                    </small>
                  </div>
                  <div className="cityInput">
                    <label className="formLabel">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="form-control"
                      value={zipCode}
                      onChange={this.onChange}
                    />
                    <small
                      className="errorMessage"
                      hidden={zipCodeErrMess === ""}
                    >
                      {zipCodeErrMess}
                    </small>
                  </div>
                </div>
              </div>
              <div className="formDataGroup">
                <label className="formLabel">Street</label>
                <input
                  type="text"
                  name="street"
                  className="form-control"
                  value={street}
                  onChange={this.onChange}
                />
                <small className="errorMessage" hidden={streetErrMess === ""}>
                  {streetErrMess}
                </small>
              </div>
            </div>
            <div className="col-lg-2 profileDataDiv"></div>
          </div>
        </div>
        <div className="saveInfoFormDiv">
          {" "}
          <button
            disabled={disabledSaveInfoBtn}
            className="saveInfoFormBtn"
            onClick={this.saveInfo}
          >
            {SAVE_INFO}{" "}
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
