import { ThemeProvider } from "@material-ui/styles";
import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import React, { Component } from "react";
import styles from "./CardInfo.css";

export class CardInfo extends Component {
  handleCardNumberChange = (cardNumber) => {
    this.props.fillCardNumber(cardNumber.empty, cardNumber.complete);
    this.props.fillElements(this.props.elements.getElement(CardNumberElement));
  };

  handleCardExpirationDateChange = (expirationDate) => {
    this.props.fillCardExpirationDate(
      expirationDate.empty,
      expirationDate.complete
    );
  };

  handleCardCVCDateChange = (cvc) => {
    this.props.fillCardCVC(cvc.empty, cvc.complete);
  };

  render() {
    const {
      cardName,
      cardNameErrMess,
      cardNumberErrMess,
      cardExpirationDateErrMess,
      cardCVCErrMess,
    } = this.props;
    return (
      <div className="row userInfoRow">
        <div className="col-lg-3 profileImageDiv"></div>
        <div className="col-lg-7 profileDataDiv">
          <div className="formDataGroup">
            <div className="cityZipCodeDiv">
              <div className="cityInput">
                <label className="formLabel">Name on card</label>
                <input
                  type="text"
                  name="cardName"
                  className="form-control"
                  value={cardName}
                  onChange={this.props.onChange}
                />
                <small className="errorMessage" hidden={cardNameErrMess === ""}>
                  {cardNameErrMess}
                </small>
              </div>
              <div className="cityInput">
                <label className="formLabel">Card Number</label>
                <CardNumberElement
                  className="form-control"
                  onChange={(cardNum) => this.handleCardNumberChange(cardNum)}
                ></CardNumberElement>
                <small
                  className="errorMessage"
                  hidden={cardNumberErrMess === ""}
                >
                  {cardNumberErrMess}
                </small>
              </div>
            </div>
          </div>
          <div className="formDataGroup">
            <div className="cityZipCodeDiv">
              <div className="cityInput">
                <label className="formLabel">Expiration Date</label>
                <CardExpiryElement
                  className="form-control"
                  onChange={(expDate) =>
                    this.handleCardExpirationDateChange(expDate)
                  }
                ></CardExpiryElement>
                <small
                  className="errorMessage"
                  hidden={cardExpirationDateErrMess === ""}
                >
                  {cardExpirationDateErrMess}
                </small>
              </div>
              <div className="cityInput">
                <label className="formLabel">CVC</label>
                <CardCvcElement
                  className="form-control"
                  onChange={(cvc) => this.handleCardCVCDateChange(cvc)}
                ></CardCvcElement>
                <small className="errorMessage" hidden={cardCVCErrMess === ""}>
                  {cardCVCErrMess}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardInfo;
