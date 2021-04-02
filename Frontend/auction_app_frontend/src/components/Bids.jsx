import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NO_PRODUCTS_TO_SHOW_MESSAGE } from "../constants/messages";
import { SINGLE_PRODUCT_ROUTE } from "../constants/routes";
import ProductService from "../services/productService";

export class Bids extends Component {
  state = { products: null };

  productService = new ProductService();

  componentDidMount = async () => {
    const { token, email } = this.props;

    var productList = await this.productService.getBidedProducts(email, token);

    this.setState({ products: productList });
  };

  render() {
    const { products } = this.state;
    const { email, token, isLoggedIn } = this.props;

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
                          product.customerPriceHighestBid ? "highestBidTd" : ""
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

export default Bids;
