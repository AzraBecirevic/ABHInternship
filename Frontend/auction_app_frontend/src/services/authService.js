import { ENDPOINT, PORT } from "../constants/auth";

class AuthService {
  endpoint;
  port;

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
      ENDPOINT + PORT + "/login",
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
      showError("Connection refused. Please try later.");
      return false;
    }

    if (response.status === 200) {
      if (rememberMe) {
        localStorage.setItem("token", response.headers.get("authorization"));
        localStorage.setItem("email", email);
      } else {
        sessionStorage.setItem("token", response.headers.get("authorization"));
        sessionStorage.setItem("email", email);
      }
      showSuccess("You have successfully logged in.");
      return true;
    } else {
      showError(
        "Something went wrong with your login, check your email and password and try again."
      );
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
      ENDPOINT + PORT + "/customer",
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
      showError("Connection refused. Please try later.");
      return false;
    }
    if (response.status === 201) {
      showSuccess("You have successfully registered.");
      return true;
    } else {
      var data = await response.json();
      showError(data.text);
      return false;
    }
  }
}

export default AuthService;
