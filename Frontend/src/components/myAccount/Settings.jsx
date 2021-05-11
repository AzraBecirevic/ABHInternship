import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import {
  DEACTIVATE_ACCOUNT_QUESTION_MESSAGE,
  SUCCESSFULLY_DEACTIVATED_ACOUNT_MESSAGE,
  NOT_DEACTIVATED_ACOUNT_MESSAGE,
  DEACTIVATE,
  DEACTIVATE_ACCOUNT_HEADING_MESSAGE,
  DEACTIVATE_ACCOUNT_QUESTION,
} from "../../constants/messages";
import { HOME_ROUTE } from "../../constants/routes";
import AuthService from "../../services/authService";
import ConfirmAlertService from "../../services/confirmAlertService";
import CustomerService from "../../services/customerService";
import ToastService from "../../services/toastService";

export class Settings extends Component {
  customerService = new CustomerService();
  toastService = new ToastService();
  confirmAlertService = new ConfirmAlertService();

  deactivateAccount = async () => {
    let confirmDeactivate = await this.confirmAlertService.showConfirmAlert(
      DEACTIVATE_ACCOUNT_HEADING_MESSAGE,
      DEACTIVATE_ACCOUNT_QUESTION
    );

    if (!confirmDeactivate) {
      return;
    }

    const { email, token, isLoggedIn } = this.props;

    var deactivated = await this.customerService.deactivateAccount(
      email,
      token
    );

    if (deactivated) {
      this.toastService.showSuccessToast(
        SUCCESSFULLY_DEACTIVATED_ACOUNT_MESSAGE
      );

      this.props.logOutCustomer();
      this.props.history.push({
        pathname: HOME_ROUTE,
        state: {
          isLoggedIn: false,
          email: "",
          token: "",
        },
      });
    }
  };

  render() {
    return (
      <div className="settingsDiv">
        <div className="userInfoDivHeading">Account</div>
        <div className="settingsMessageBtnDiv">
          <div>{DEACTIVATE_ACCOUNT_QUESTION_MESSAGE}</div>
          <button onClick={this.deactivateAccount} className="deactivateBtn">
            {DEACTIVATE}
          </button>
        </div>
      </div>
    );
  }
}

export default Settings;
