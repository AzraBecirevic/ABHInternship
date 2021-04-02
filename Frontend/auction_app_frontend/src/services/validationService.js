import { parseJSON } from "jquery";
import { EMAIL } from "../constants/auth";
import {
  CITY_REGEX,
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
  STREET_REGEX,
  ZIP_CODE_REGEX,
} from "../constants/regex";

class ValidationService {
  validateFirstName = (firstName) => {
    if (firstName === "") {
      return false;
    }
    return true;
  };

  validateLastName = (lastName) => {
    if (lastName === "") {
      return false;
    }
    return true;
  };

  validateEmail = (email) => {
    if (email === "") {
      return false;
    }
    return true;
  };

  validateFormat(text, regex) {
    const re = regex;
    return re.test(String(text).toLowerCase());
  }

  validateEmailFormat(email) {
    if (email !== "" && this.validateFormat(email, EMAIL_REGEX) === false) {
      return false;
    }
    return true;
  }

  validatePhone = (phoneNumber) => {
    if (phoneNumber === "") {
      return false;
    }
    return true;
  };

  validatePhoneFormat(phoneNumber) {
    if (
      phoneNumber !== "" &&
      this.validateFormat(phoneNumber, PHONE_NUMBER_REGEX) === false
    ) {
      return false;
    }
    return true;
  }

  validateCity = (city) => {
    if (city === "") {
      return false;
    }
    return true;
  };

  validateCityFormat = (city) => {
    if (city !== "" && this.validateFormat(city, CITY_REGEX) == false) {
      return false;
    }
    return true;
  };

  validateZipCode = (zipCode) => {
    if (zipCode === "") {
      return false;
    }
    return true;
  };

  validateZipCodeFormat = (zipCode) => {
    if (
      zipCode !== "" &&
      this.validateFormat(zipCode, ZIP_CODE_REGEX) == false
    ) {
      return false;
    }
    return true;
  };

  validateStreet = (street) => {
    if (street === "") {
      return false;
    }
    return true;
  };

  validateStreetFormat = (street) => {
    if (street !== "" && this.validateFormat(street, STREET_REGEX) == false) {
      return false;
    }
    return true;
  };

  validateCountry = (country) => {
    if (country === "") {
      return false;
    }
    return true;
  };

  validateRegion = (region) => {
    if (region === "") {
      return false;
    }
    return true;
  };
}
export default ValidationService;
