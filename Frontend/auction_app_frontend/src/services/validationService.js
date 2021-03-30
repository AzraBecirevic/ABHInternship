import { parseJSON } from "jquery";
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from "../constants/regex";

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
  };

  validateFormatEmail(email) {
    const re = EMAIL_REGEX;
    return re.test(String(email).toLowerCase());
  }

  validateEmailFormat(email) {
    if (email !== "" && this.validateFormatEmail(email) === false) {
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

  validateFormatPhoneNumber(phoneNumber) {
    const re = PHONE_NUMBER_REGEX;
    return re.test(String(phoneNumber).toLowerCase());
  }

  validatePhoneFormat(phoneNumber) {
    if (
      phoneNumber !== "" &&
      this.validateFormatPhoneNumber(phoneNumber) === false
    ) {
      return false;
    }
    return true;
  }
}
export default ValidationService;
