import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  ACTIVE,
  ADD_ITEM,
  NO_PRODUCTS_TO_SHOW_MESSAGE,
  SOLD_ITEMS,
} from "../constants/messages";
import { ADD_ITEM_ROUTE, SINGLE_PRODUCT_ROUTE } from "../constants/routes";
import CustomerService from "../services/customerService";
import ProductService from "../services/productService";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Seller.css";
import AddItem from "./AddItem";

export class Seller extends Component {
  state = { products: null, activeChosen: true };

  productService = new ProductService();

  componentDidMount = async () => {
    const { token, userEmail, isLoggedIn } = this.props;
    var productList = null;
    if (this.state.activeChosen) {
      productList = await this.productService.getActiveProducts(
        userEmail,
        token
      );
    } else {
      productList = await this.productService.getSoldProducts(userEmail, token);
    }
    this.setState({ products: productList });
  };

  chooseActive = async () => {
    const { token, userEmail } = this.props;
    var productList = await this.productService.getActiveProducts(
      userEmail,
      token
    );
    this.setState({ products: productList, activeChosen: true });
  };
  chooseSold = async () => {
    const { token, userEmail } = this.props;
    var productList = await this.productService.getSoldProducts(
      userEmail,
      token
    );
    this.setState({ products: productList, activeChosen: false });
  };

  render() {
    const { activeChosen, products } = this.state;
    const { userEmail, token, isLoggedIn } = this.props;
    return (
      <div>
        <div className="sellerOptionsDiv">
          <div className="activeSoldOptionsDiv">
            <div
              className={
                activeChosen ? "activeSoldOptionActive" : "activeSoldOption"
              }
              onClick={this.chooseActive}
            >
              {ACTIVE}
            </div>
            <div
              className={
                activeChosen ? "activeSoldOption" : "activeSoldOptionActive"
              }
              onClick={this.chooseSold}
            >
              {SOLD_ITEMS}
            </div>
          </div>
          <Link
            className="addItemOptionLink"
            to={{
              pathname: ADD_ITEM_ROUTE,
              state: {
                isLoggedIn: isLoggedIn,
                email: userEmail,
                token: token,
              },
            }}
          >
            <div className="addItemOptionDiv">
              <FontAwesomeIcon
                className="tabDivIcon"
                icon={faPlus}
                size={"sm"}
              ></FontAwesomeIcon>{" "}
              {ADD_ITEM}
            </div>
          </Link>
        </div>
        {products !== null && products.length > 0 && (
          <div className="activeSoldProductsDiv">
            <Table responsive className="activeSoldTable">
              <thead>
                <tr className="headingTr">
                  <td>Item</td>
                  <td>Name</td>
                  {activeChosen && <td>Time left</td>}
                  <td align="center">Start price</td>
                  <td align="center">No. bids</td>
                  <td align="center">Highest bid</td>
                  <td align="center"></td>
                </tr>
              </thead>

              <tbody>
                {products.map(function (product, index) {
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
                              email: userEmail,
                              token: token,
                            },
                          }}
                        >
                          {product.name}
                        </Link>
                      </td>
                      {activeChosen && <td>{product.timeLeft} days</td>}
                      <td align="center">$ {product.startPrice}</td>
                      <td align="center">{product.numberOfBids}</td>
                      <td
                        align="center"
                        className={
                          product.bidHighest ? "highestBidTd" : "bidTd"
                        }
                      >
                        $ {product.highestBid}
                      </td>
                      <td align="center">
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
                              email: userEmail,
                              token: token,
                            },
                          }}
                        >
                          <button className="activeSoldViewButton">VIEW</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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

export default Seller;
