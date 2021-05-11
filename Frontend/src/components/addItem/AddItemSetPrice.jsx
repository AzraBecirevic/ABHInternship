import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import { PRODUCT_DATES_RULE_MESSAGE } from "../../constants/messages";

export class AddItemSetPrice extends Component {
  render() {
    const {
      startPrice,
      startPriceErrMessage,
      startDate,
      startDateErrMess,
      endDate,
      endDateErrMess,
      doneBtnDisabled,
    } = this.props;
    return (
      <div className="userInfoDiv">
        <div className="userInfoDivHeading startSelling">SET PRICES</div>
        <div className="tabFormDiv">
          <form>
            <div className="formDataGroup">
              <label className="formLabel">Your start price</label>
              <div className="startPriceInputDiv">
                <div className="starPriceValuteDiv">$</div>
                <input
                  type="number"
                  name="startPrice"
                  className="form-control setPrices"
                  value={startPrice}
                  onChange={this.props.onChange}
                />
              </div>

              <small
                className="errorMessage"
                hidden={startPriceErrMessage === ""}
              >
                {startPriceErrMessage}
              </small>
            </div>
            <div className="formDataGroup">
              <div className="cityZipCodeDiv dates">
                <div className="cityInput">
                  <label className="formLabel">Start date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control setPrices"
                    value={startDate}
                    onChange={this.props.onChange}
                  />
                  <small
                    className="errorMessage"
                    hidden={startDateErrMess === ""}
                  >
                    {startDateErrMess}
                  </small>
                </div>
                <div className="cityInput">
                  <label className="formLabel">End date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-control setPrices"
                    value={endDate}
                    onChange={this.props.onChange}
                  />
                  <small
                    className="errorMessage"
                    hidden={endDateErrMess === ""}
                  >
                    {endDateErrMess}
                  </small>
                </div>
              </div>
              <div className="startEndDateMessageDiv">
                {PRODUCT_DATES_RULE_MESSAGE}
              </div>
            </div>
          </form>
          <div className="nextBackDoneBtnDivSetPrices">
            <button
              className="btnBackNext backBtnAddItem"
              onClick={this.props.goBack}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={"sm"}
              ></FontAwesomeIcon>{" "}
              BACK
            </button>
            <button
              className={
                doneBtnDisabled
                  ? "btnBackNext backBtnAddItem"
                  : "btnBackNext nextBtnAddItem"
              }
              onClick={this.props.done}
              disabled={doneBtnDisabled}
            >
              DONE{" "}
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

export default AddItemSetPrice;
