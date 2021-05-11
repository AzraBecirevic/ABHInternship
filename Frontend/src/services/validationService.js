import { parseJSON } from "jquery";
import { EMAIL } from "../constants/auth";
import { PASSWORD_FORMAT_MESSAGE } from "../constants/messages";
import {
  BID_REGEX,
  CITY_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  STREET_REGEX,
  ZIP_CODE_REGEX,
} from "../constants/regex";

class ValidationService {
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

  validatePasswordFormat(password) {
    if (
      password !== "" &&
      this.validateFormat(password, PASSWORD_REGEX) === false
    ) {
      return false;
    }
    return true;
  }

  validatePhoneFormat(phoneNumber) {
    if (
      phoneNumber !== "" &&
      this.validateFormat(phoneNumber, PHONE_NUMBER_REGEX) === false
    ) {
      return false;
    }
    return true;
  }

  validateCityFormat = (city) => {
    if (city !== "" && this.validateFormat(city, CITY_REGEX) == false) {
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

  validateStreetFormat = (street) => {
    if (street !== "" && this.validateFormat(street, STREET_REGEX) == false) {
      return false;
    }
    return true;
  };

  validateProductNameFormat = (productName) => {
    if (productName !== "" && productName.length > 60) {
      return false;
    }
    return true;
  };

  validateDescriptionFormat = (description) => {
    if (description !== "" && description.length > 700) {
      return false;
    }
    return true;
  };

  validateStartPriceFormat = (startPrice) => {
    if (
      startPrice !== "" &&
      this.validateFormat(startPrice, BID_REGEX) == false
    ) {
      return false;
    }
    return true;
  };

  validateStartDate = (startDate) => {
    return startDate !== "";
  };

  validateRequiredFiled = (text) => {
    return text !== "";
  };
}
export default ValidationService;
