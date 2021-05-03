import { ENDPOINT } from "../constants/auth";
import { SAVE_NOTIFICATION_TOKEN } from "../constants/endpoints";

class NotificationService {
  async saveNotificationToken(email, notificationToken) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: email,
        token: notificationToken,
      }),
    };

    const response = await fetch(
      ENDPOINT + SAVE_NOTIFICATION_TOKEN,
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
export default NotificationService;
