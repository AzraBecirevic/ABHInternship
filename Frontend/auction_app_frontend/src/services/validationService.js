import { parseJSON } from "jquery";
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

  validateCity = (city) => {
    if (city === "") {
      return false;
    }
    return true;
  };

  validateCityFormat = (city) => {
    if (city !== "" && this.validateFormatCity(city) == false) {
      return false;
    }
    return true;
  };
  validateFormatCity(city) {
    const re = CITY_REGEX;
    return re.test(String(city).toLowerCase());
  }

  validateZipCode = (zipCode) => {
    if (zipCode === "") {
      return false;
    }
    return true;
  };

  validateZipCodeFormat = (zipCode) => {
    if (zipCode !== "" && this.validateFormatZipCode(zipCode) == false) {
      return false;
    }
    return true;
  };

  validateFormatZipCode(zipCode) {
    const re = ZIP_CODE_REGEX;
    return re.test(String(zipCode).toLowerCase());
  }

  validateStreet = (street) => {
    if (street === "") {
      return false;
    }
    return true;
  };

  validateStreetFormat = (street) => {
    if (street !== "" && this.validateFormatStreet(street) == false) {
      return false;
    }
    return true;
  };

  validateFormatStreet(street) {
    const re = STREET_REGEX;
    return re.test(String(street).toLowerCase());
  }

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
