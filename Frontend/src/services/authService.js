import { ENDPOINT } from "../constants/auth";
import {
  ADD_CUSTOMER_SOCIAL_MEDIA_LOGIN,
  CHANGE_PASSWORD_ENDPOINT,
  CHECK_IF_ACCOUNT_IS_ACTIVE,
  FORGOT_PASSWORD_ENDPONT,
  LOGIN_ENDPOINT,
  REGISTER_ENDPOINT,
} from "../constants/endpoints";
import {
  CONNECTION_REFUSED_MESSAGE,
  FAIL_LOGIN_MESSAGE,
  NOT_ACTIVE_ACCOUNT_MESSAGE,
  SUCCESSFUL_LOGIN_MESSAGE,
  SUCCESSFUL_REGISTER_MESSAGE,
} from "../constants/messages";
import { FORGOT_PASSWORD_EMAIL } from "../constants/storage";

class AuthService {
  async isUserActive(email) {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      ENDPOINT + CHECK_IF_ACCOUNT_IS_ACTIVE + email,
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

  async login(
    email,
    password,
    rememberMe,
    showError,
    showSuccess,
    setIsLoading
  ) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    };
    const response = await fetch(
      ENDPOINT + LOGIN_ENDPOINT,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });
    setIsLoading(false);
    if (!response) {
      showError(CONNECTION_REFUSED_MESSAGE);
      return false;
    }
    if (response.status === 200) {
      var accountActive = await this.isUserActive(email);
      if (accountActive !== true) {
        showError(NOT_ACTIVE_ACCOUNT_MESSAGE);
        return false;
      }
      if (rememberMe) {
        localStorage.setItem("token", response.headers.get("authorization"));
        localStorage.setItem("email", email);
      } else {
        sessionStorage.setItem("token", response.headers.get("authorization"));
        sessionStorage.setItem("email", email);
      }
      showSuccess(SUCCESSFUL_LOGIN_MESSAGE);
      return true;
    } else {
      if (response.status === 404) {
        showError(CONNECTION_REFUSED_MESSAGE);
      } else {
        showError(FAIL_LOGIN_MESSAGE);
      }

      return false;
    }
  }

  async registerUser(
    firstName,
    lastName,
    email,
    password,
    showError,
    showSuccess,
    setIsLoading
  ) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      }),
    };

    const response = await fetch(
      ENDPOINT + REGISTER_ENDPOINT,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });
    setIsLoading(false);
    if (!response) {
      showError(CONNECTION_REFUSED_MESSAGE);
      return false;
    }
    if (response.status === 201) {
      showSuccess(SUCCESSFUL_REGISTER_MESSAGE);
      return true;
    } else {
      try {
        var data = await response.json();
        showError(data.text);
      } catch (err) {
        showError(CONNECTION_REFUSED_MESSAGE);
      }
      return false;
    }
  }

  async forgotPassword(email, setIsLoading) {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      ENDPOINT + FORGOT_PASSWORD_ENDPONT + email,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });
    setIsLoading(false);
    if (!response || response.status === 404) {
      throw response;
    }

    if (response.status === 200) {
      localStorage.setItem(FORGOT_PASSWORD_EMAIL, email);
      return true;
    } else {
      return false;
    }
  }

  async changePassword(email, password, setIsLoading) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    const response = await fetch(
      ENDPOINT + CHANGE_PASSWORD_ENDPOINT,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });
    setIsLoading(false);
    if (!response || response.status === 404) {
      throw response;
    }
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  logout = () => {
    const logoutKeys = ["email", "token"];
    logoutKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  };

  async signUpViaSocialMedia(
    name,
    email,
    provider,
    providerId,
    accessToken,
    firstName,
    lastName,
    pass
  ) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        provider: provider,
        providerId: providerId,
        accessToken: accessToken,
        firstName: firstName,
        lastName: lastName,
        password: pass,
      }),
    };

    const response = await fetch(
      ENDPOINT + ADD_CUSTOMER_SOCIAL_MEDIA_LOGIN,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });

    if (!response) {
      return false;
    }
    if (response.status === 201 || response.status === 200) {
      return true;
    } else {
      return false;
    }
  }
}

export default AuthService;
