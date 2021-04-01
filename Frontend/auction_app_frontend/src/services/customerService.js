import { faPhabricator } from "@fortawesome/free-brands-svg-icons";
import { ENDPOINT } from "../constants/auth";
import {
  GET_CUSTOMER_DELIVERY_DATA_ENDPOINT,
  GET_CUSTOMER_INFO_DATA,
  UPDATE_CUSTOMER_DELIVERY_DATA_ENDPOINT,
  UPDATE_CUSTOMER_ENDPOINT,
  UPDATE_CUSTOMER_PHOTO_ENDPOINT,
} from "../constants/endpoints";
import {
  SUCCESSFUL_CUSTOMER_UPDATE_MESSAGE,
  CONNECTION_REFUSED_MESSAGE,
  SUCCESSFUL_CUSTOMER_UPDATE_LOGIN_MESSAGE,
} from "../constants/messages";

class CustomerService {
  async getCustomerInfoData(email, token) {
    return await this.getData(GET_CUSTOMER_INFO_DATA + email, token);
  }

  async getCustomerDeliveryData(email, token) {
    return await this.getData(
      GET_CUSTOMER_DELIVERY_DATA_ENDPOINT + email,
      token
    );
  }

  async upadateCustomerPhoto(email, token, imgFile, showError) {
    const formData = new FormData();
    formData.append("imgFile", imgFile);

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    };

    const response = await fetch(
      ENDPOINT + UPDATE_CUSTOMER_PHOTO_ENDPOINT + email,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });

    if (!response) {
      throw response;
    }
    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      try {
        var data = await response.json();
        showError(data.text);
        return null;
      } catch (err) {}
      return null;
    }
  }

  async updateCustomerDeliveryData(
    email,
    token,
    country,
    region,
    city,
    zipCode,
    street,
    showError
  ) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        street: street,
        zipCode: zipCode,
        city: city,
        region: region,
        country: country,
      }),
    };

    const response = await fetch(
      ENDPOINT + UPDATE_CUSTOMER_DELIVERY_DATA_ENDPOINT + email,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });

    if (!response) {
      throw response;
    }
    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      try {
        var data = await response.json();
        showError(data.text);
        return null;
      } catch (err) {}
      return null;
    }
  }

  async updateCustomer(
    email,
    token,
    firstName,
    lastName,
    newEmail,
    genderId,
    phoneNumber,
    birthDay,
    birthMonth,
    birthYear,
    showError
  ) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: newEmail,
        genderId: genderId,
        phoneNumber: phoneNumber,
        birthDay: birthDay,
        birthMonth: birthMonth,
        birthYear: birthYear,
      }),
    };

    const response = await fetch(
      ENDPOINT + UPDATE_CUSTOMER_ENDPOINT + email,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });

    if (!response) {
      throw response;
    }

    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      try {
        var data = await response.json();

        showError(data.text); // ?

        return null;
      } catch (err) {
        //showError("greska"); //
      }
      return null;
    }
  }

  async getData(link, token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };
    const response = await fetch(ENDPOINT + link, requestOptions).catch(
      (error) => {
        if (!error.response) {
          return null;
        } else {
          return;
        }
      }
    );
    if (!response) {
      throw response;
    }

    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      return null;
    }
  }
}
export default CustomerService;
