import { faPhabricator } from "@fortawesome/free-brands-svg-icons";
import { ENDPOINT } from "../constants/auth";
import {
  CHECK_IF_CUSTOMER_HAS_CARD,
  DEACTIVATE_ACCOUNT_ENDPOINT,
  GET_CUSTOMER_DELIVERY_DATA_ENDPOINT,
  GET_CUSTOMER_INFO_DATA,
  IS_CUSTOMER_SELLING_PRODUCTS_ENDPOINT,
  UPDATE_CUSTOMER_DELIVERY_DATA_ENDPOINT,
  UPDATE_CUSTOMER_ENDPOINT,
  UPDATE_CUSTOMER_PHOTO_ENDPOINT,
} from "../constants/endpoints";

import ToastService from "./toastService";

class CustomerService {
  toastService = new ToastService();

  async getCustomerInfoData(email, token) {
    return await this.getData(GET_CUSTOMER_INFO_DATA + email, token);
  }

  async getCustomerDeliveryData(email, token) {
    return await this.getData(
      GET_CUSTOMER_DELIVERY_DATA_ENDPOINT + email,
      token
    );
  }

  async hasCustomerSellingProducts(email, token) {
    return await this.getData(
      IS_CUSTOMER_SELLING_PRODUCTS_ENDPOINT + email,
      token
    );
  }

  async deactivateAccount(email, token) {
    return await this.getData(DEACTIVATE_ACCOUNT_ENDPOINT + email, token);
  }

  async upadateCustomerPhoto(email, token, imgFile) {
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
      let data = await response.json();
      return data;
    } else {
      try {
        let data = await response.json();
        this.toastService.showErrorToast(data.text);
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
    street
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
      let data = await response.json();
      return data;
    } else {
      try {
        let data = await response.json();
        this.toastService.showErrorToast(data.text);
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
    birthYear
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
      let data = await response.json();
      return data;
    } else {
      try {
        let data = await response.json();
        this.toastService.showErrorToast(data.text);
        return null;
      } catch (err) {}
      return null;
    }
  }

  async checkIfUserHaveStripeId(email, token) {
    return await this.getData(CHECK_IF_CUSTOMER_HAS_CARD + email, token);
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
    if (response.status === 403) {
      try {
        let data = await response.json();
        this.toastService.showErrorToast(data.text);
      } catch (error) {
        return null;
      }
      return null;
    }
    if (response.status === 400) {
      try {
        let data = await response.json();
        this.toastService.showErrorToast(data.text);
      } catch (error) {
        return null;
      }
      return null;
    }

    if (response.status === 200) {
      let data = await response.json();
      return data;
    } else {
      return null;
    }
  }
}
export default CustomerService;
