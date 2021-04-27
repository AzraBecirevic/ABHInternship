import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BID_PRICE_BIGGER_THAN_HIGHEST_BID_MESSAGE,
  FAILED_PAYMENT,
  NO_PRODUCTS_TO_SHOW_MESSAGE,
  PAYMENT_NEW_CARD_QUESTION_MESSAGE,
  PAYMENT_QUESTION,
  SUCCESSFUL_PAYMENT,
  PAYMENT_INFO_MESSAGE,
} from "../constants/messages";
import { BIDS_ROUTE, SINGLE_PRODUCT_ROUTE } from "../constants/routes";
import ProductService from "../services/productService";
import CustomerService from "../services/customerService";
import StripeService from "../services/stripeService";
import { loadStripe } from "@stripe/stripe-js";
import { EMAIL, ENDPOINT, TOKEN } from "../constants/auth";
import ToastService from "../services/toastService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export class Bids extends Component {
  state = { products: null, email: "", token: "", isLoggedIn: false };

  productService = new ProductService();
  customerService = new CustomerService();
  stripeService = new StripeService();
  toastServivce = new ToastService();
  stripePromise = null;

  componentDidMount = async () => {
    let email = "";
    let token = "";
    let isLoggedIn = false;

    if (this.props.location == null || this.props.location.state == null) {
      if (localStorage.getItem(TOKEN) != null) {
        isLoggedIn = true;
        email = localStorage.getItem(EMAIL);
        token = localStorage.getItem(TOKEN);
      } else if (sessionStorage.getItem(TOKEN) != null) {
        isLoggedIn = true;
        email = sessionStorage.getItem(EMAIL);
        token = sessionStorage.getItem(TOKEN);
      }
    } else {
      isLoggedIn = this.props.location.state.isLoggedIn;
      email = this.props.location.state.email;
      token = this.props.location.state.token;
    }

    if (this.props.location != null && this.props.location.search != "") {
      if (this.props.location.search === "?success=true") {
        this.toastServivce.showSuccessToast(SUCCESSFUL_PAYMENT);
        let productId = localStorage.getItem("soldProductId");
        const result = await this.productService.saveSoldProduct(
          productId,
          token
        );
      } else if (this.props.location.search === "?canceled=true") {
        this.toastServivce.showErrorToast(FAILED_PAYMENT);
      }
    }

    var productList = await this.productService.getBidedProducts(email, token);

    this.setState({
      products: productList,
      email: email,
      token: token,
      isLoggedIn: isLoggedIn,
    });
  };

  loadData = async () => {
    const { token, email } = this.state;

    var productList = await this.productService.getBidedProducts(email, token);

    this.setState({ products: productList });
  };

  onPayClick = async (productId) => {
    let confirmPayment = await this.showConfirmAlert(
      "Make payment",
      PAYMENT_INFO_MESSAGE + PAYMENT_QUESTION
    );

    if (confirmPayment === true) {
      const { token, email } = this.state;
      let stripePublicKey = await this.stripeService.getPublicKey(token);
      this.stripePromise = loadStripe(stripePublicKey.publicKey);

      this.makePayment(productId, token, email);
    }
  };

  makePayment = async (productId, token, email) => {
    const userHaveCard = await this.customerService.checkIfUserHaveStripeId(
      email,
      token
    );

    if (userHaveCard) {
      this.makeNewCardPayment(email, token, productId);
    } else {
      this.makeNewPayment(email, token, productId);
    }
  };

  makeNewCardPayment = async (email, token, productId) => {
    let paymentIntent = await this.stripeService.createPaymentIntent(
      email,
      token,
      productId
    );

    if (paymentIntent !== null) {
      if (paymentIntent.status === "succeeded") {
        this.toastServivce.showSuccessToast(SUCCESSFUL_PAYMENT);
        const result = await this.productService.saveSoldProduct(
          productId,
          token
        );
        this.loadData();
      } else {
        let result = await (await this.stripePromise).confirmCardPayment(
          paymentIntent.client_secret,
          {
            payment_method: paymentIntent.last_payment_error.payment_method.id,
          }
        );
        if (result.error) {
          let enterNewCard = await this.showConfirmAlert(
            "Make payment",
            result.error.message + PAYMENT_NEW_CARD_QUESTION_MESSAGE
          );
          if (enterNewCard === true) {
            this.makeNewPayment(email, token, productId);
          }
        } else {
          if (result.paymentIntent.status === "succeeded") {
            this.toastServivce.showSuccessToast(SUCCESSFUL_PAYMENT);
            const result = await this.productService.saveSoldProduct(
              productId,
              token
            );
            this.loadData();
          }
        }
      }
    }
  };

  makeNewPayment = async (email, token, productId) => {
    const response = await this.stripeService.createChecoutSession(
      email,
      token,
      productId
    );

    localStorage.setItem("soldProductId", productId);

    if (response !== null) {
      const result = await (await this.stripePromise).redirectToCheckout({
        sessionId: response.id,
      });
      if (result.error) {
        this.toastServivce.showErrorToast(result.error.message);
      }
    }
  };

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

  render() {
    const { products, email, token, isLoggedIn } = this.state;

    return (
      <div className="bidTabDiv">
        {products !== null && products.length > 0 && (
          <div className="activeSoldProductsDiv">
            <Table responsive className="activeSoldTable">
              <thead>
                <tr className="headingTr">
                  <td>Item</td>
                  <td>Name</td>
                  <td>Time left</td>
                  <td align="center">Your price</td>
                  <td align="center">No. bids</td>
                  <td align="center">Highest bid</td>
                  <td align="center"></td>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  function (product, index) {
                    return (
                      <tr className="no-border" key={index}>
                        <td>
                          <img
                            className="activeSoldProductImages"
                            src={`data:image/png;base64, ${product.image}`}
                          ></img>
                        </td>
                        <td>
                          <Link
                            className="activeSoldProductName"
                            to={{
                              pathname: SINGLE_PRODUCT_ROUTE.replace(
                                ":prodId",
                                product.id
                              ),
                              state: {
                                chosenProduct: product.id,
                                isLoggedIn: isLoggedIn,
                                email: email,
                                token: token,
                              },
                            }}
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td>{product.timeLeft} days</td>
                        <td
                          align="center"
                          className={
                            product.customerPriceHighestBid
                              ? "highestBidTd"
                              : ""
                          }
                        >
                          $ {product.customerBidPrice}
                        </td>
                        <td align="center">{product.numberOfBids}</td>
                        <td
                          align="center"
                          className={
                            product.customerPriceHighestBid
                              ? "highestBidTd"
                              : "bidTd"
                          }
                        >
                          $ {product.highestBid}
                        </td>
                        <td align="center">
                          {!product.paymentEnabled && (
                            <Link
                              className="activeSoldProductName"
                              to={{
                                pathname: SINGLE_PRODUCT_ROUTE.replace(
                                  ":prodId",
                                  product.id
                                ),
                                state: {
                                  chosenProduct: product.id,
                                  isLoggedIn: isLoggedIn,
                                  email: email,
                                  token: token,
                                },
                              }}
                            >
                              <button className="activeSoldViewButton">
                                VIEW
                              </button>
                            </Link>
                          )}
                          {product.paymentEnabled && (
                            <button
                              className="activeSoldPayButton"
                              onClick={() => {
                                this.onPayClick(product.id);
                              }}
                            >
                              PAY
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }.bind(this)
                )}
              </tbody>
            </Table>
          </div>
        )}
        {(products == null || products.length <= 0) && (
          <div className="activeSoldNoProductsMessage">
            {NO_PRODUCTS_TO_SHOW_MESSAGE}
          </div>
        )}
      </div>
    );
  }
}

export default Bids;
