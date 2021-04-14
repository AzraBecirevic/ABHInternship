import React, { Component } from "react";
import {
  NO_ITEMS_FOR_SALE_MESSAGE,
  START_SELLING,
} from "../constants/messages";
import shoppingBagImage from "../assets/shoppingBagImage.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ADD_ITEM_ROUTE, HOME_ROUTE } from "../constants/routes";

export class Sell extends Component {
  startSelling = () => {
    this.props.history.push({
      pathname: ADD_ITEM_ROUTE,
      state: {
        isLoggedIn: this.props.isLoggedIn,
        email: this.props.email,
        token: this.props.token,
      },
    });
  };
  render() {
    return (
      <div>
        <div className="startSellingDiv">
          <div className="userInfoDivHeading startSelling">SELL</div>
          <div className="startSellingMessageDiv">
            <img className="startSellingImg" src={shoppingBagImage} />
            <div className="startSellingMessage">
              {NO_ITEMS_FOR_SALE_MESSAGE}
            </div>
            <button className="startSellingBtn" onClick={this.startSelling}>
              {" "}
              {START_SELLING}{" "}
              <FontAwesomeIcon
                icon={faChevronRight}
                size={"sm"}
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Sell;
