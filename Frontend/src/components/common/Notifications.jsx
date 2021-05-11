import React, { Component } from "react";
import styles from "./Notifications.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CLEAR_ALL_NOTIFICATION_MESSAGE,
  NO_UNREAD_NOTIFICATION_MESSAGE,
} from "../../constants/messages";

export class Notifications extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeNotifications();
    }
  };

  setNotificationRead = async (notificationId) => {
    await this.props.setNotificationRead(notificationId);
  };

  clearAllNotifications = async () => {
    await this.props.clearAllNotifications();
  };

  render() {
    const { notifications } = this.props;
    return (
      <div className="notificationDiv" ref={this.setWrapperRef}>
        <div className="notificationDivClose">
          {" "}
          <FontAwesomeIcon
            className="closeSingleNotificationIcon"
            icon={faTimes}
            size={"lg"}
            onClick={() => this.props.closeNotifications()}
          />
        </div>
        {notifications !== null &&
          notifications.length > 0 &&
          notifications.map(
            function (notification, index) {
              return (
                <div key={index} className="singleNotificationDiv">
                  <div className="notificationHeadingCloseDiv">
                    <b className="notificationHeading">
                      {notification.heading}
                    </b>
                    <FontAwesomeIcon
                      className="closeSingleNotificationIcon"
                      icon={faTimes}
                      size={"lg"}
                      onClick={() => this.setNotificationRead(notification.id)}
                    />
                  </div>
                  <div className="notificationText">{notification.text}</div>
                </div>
              );
            }.bind(this)
          )}
        {notifications !== null && notifications.length > 0 && (
          <div
            className="notificationMessage"
            onClick={this.clearAllNotifications}
          >
            {CLEAR_ALL_NOTIFICATION_MESSAGE}
          </div>
        )}
        {(notifications == null || notifications.length <= 0) && (
          <div className="noNotificationMessage">
            {NO_UNREAD_NOTIFICATION_MESSAGE}
          </div>
        )}
      </div>
    );
  }
}

export default Notifications;
