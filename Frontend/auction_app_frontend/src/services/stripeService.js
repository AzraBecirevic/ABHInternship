import { ENDPOINT } from "../constants/auth";
import { CREATE_SETUP_INTENT, GET_PUBLIC_KEY } from "../constants/endpoints";

class StripeService {
  async createSetupIntent(email, token) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        email: email,
      }),
    };

    const response = await fetch(
      ENDPOINT + CREATE_SETUP_INTENT,
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
        this.toastService.showErrorToast(data.text);
        return null;
      } catch (err) {}
      return null;
    }
  }

  async getPublicKey(token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };
    const response = await fetch(
      ENDPOINT + GET_PUBLIC_KEY,
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
      return null;
    }
  }
}
export default StripeService;
