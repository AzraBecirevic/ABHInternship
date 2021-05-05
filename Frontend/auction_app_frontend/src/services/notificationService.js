import { ENDPOINT } from "../constants/auth";
import {
  GET_CUSTOMER_UNREAD_NOTIFICATIONS,
  SAVE_NOTIFICATION_TOKEN,
  CLEAR_CUSTOMERS_ALL_NOTIFICATION,
  CLEAR_CUSTOMERS_SINGLE_NOTIFICATION,
} from "../constants/endpoints";

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

  async getCustomersUnreadNotifications(email) {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      ENDPOINT + GET_CUSTOMER_UNREAD_NOTIFICATIONS + email,
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
      try {
        var data = await response.json();
        return data;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }

  async clearAllNotification(email, token) {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: token },
    };
    const response = await fetch(
      ENDPOINT + CLEAR_CUSTOMERS_ALL_NOTIFICATION + email,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return false;
      } else {
        return;
      }
    });
    if (!response) {
      return false;
    }

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  async clearNotification(notificationId, email, token) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        notificationId: notificationId,
        email: email,
      }),
    };
    const response = await fetch(
      ENDPOINT + CLEAR_CUSTOMERS_SINGLE_NOTIFICATION,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return false;
      } else {
        return;
      }
    });
    if (!response) {
      return false;
    }

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  }
}
export default NotificationService;
