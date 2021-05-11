import { confirmAlert } from "react-confirm-alert";

class ConfirmAlertService {
  showConfirmAlertAsync = (showTitle, showMessage) => {
    return new Promise((resolve, reject) => {
      confirmAlert({
        title: showTitle,
        message: showMessage,
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              resolve(true);
            },
          },
          {
            label: "No",
            onClick: () => {
              resolve(false);
            },
          },
        ],
      });
    });
  };

  showConfirmAlert = async (showTitle, showMessage) => {
    let confirmedAlert = await this.showConfirmAlertAsync(
      showTitle,
      showMessage
    );
    return confirmedAlert;
  };
}
export default ConfirmAlertService;
