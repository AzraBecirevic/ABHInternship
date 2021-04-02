import React, { Component } from "react";
import {
  DEACTIVATE_ACCOUNT_QUESTION_MESSAGE,
  SUCCESSFULLY_DEACTIVATED_ACOUNT_MESSAGE,
  NOT_DEACTIVATED_ACOUNT_MESSAGE,
} from "../constants/messages";
import { HOME_ROUTE } from "../constants/routes";
import AuthService from "../services/authService";
import CustomerService from "../services/customerService";
import ToastService from "../services/toastService";

export class Settings extends Component {
  customerService = new CustomerService();
  authService = new AuthService();
  toastService = new ToastService();

  deactivateAccount = async () => {
    const { email, token, isLoggedIn } = this.props;

    var deactivated = await this.customerService.deactivateAccount(
      email,
      token
    );

    if (deactivated) {
      var message = { SUCCESSFULLY_DEACTIVATED_ACOUNT_MESSAGE };
      this.toastService.showSuccessToast(message);
      this.authService.logout();

      this.props.history.push({
        pathname: HOME_ROUTE,
        state: {
          isLoggedIn: false,
          email: "",
          token: "",
        },
      });
    } else {
      var message = { NOT_DEACTIVATED_ACOUNT_MESSAGE };
      this.toastService.showErrorToast(message);
    }
  };

  render() {
    return (
      <div className="settingsDiv">
        <div className="userInfoDivHeading">Account</div>
        <div className="settingsMessageBtnDiv">
          <div>{DEACTIVATE_ACCOUNT_QUESTION_MESSAGE}</div>
          <button onClick={this.deactivateAccount} className="deactivateBtn">
            DEACTIVATE
          </button>
        </div>
      </div>
    );
  }
}

export default Settings;
