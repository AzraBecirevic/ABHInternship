import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { SINGLE_PRODUCT_ROUTE } from "../constants/routes";

export class TabsProducts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <InfiniteScroll
        dataLength={this.props.array == null ? 0 : this.props.array.length}
        next={this.props.fetchMore}
        hasMore={this.props.hasMore}
        loader={<p className="infLoadingMessage">Loading...</p>}
        endMessage={
          <p className="infErrorMessage">
            <b>There are no more products to show.</b>
          </p>
        }
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="row imagetiles">
              {this.props.array != null &&
                this.props.array.map(
                  function (product) {
                    return (
                      <div
                        className="col-lg-3 col-md-3 col-sm-6 col-xs-6 tabsProductDiv"
                        key={product.id}
                        style={{ marginTop: "40px" }}
                      >
                        <Link
                          to={{
                            pathname: SINGLE_PRODUCT_ROUTE,
                            state: {
                              chosenProduct: product.id,
                              isLoggedIn: this.props.isLoggedIn,
                              email: this.props.email,
                              token: this.props.token,
                            },
                          }}
                        >
                          <img
                            className="tabProductImage"
                            src={`data:image/png;base64, ${product.image}`}
                          />
                        </Link>

                        <div>
                          <Link
                            className="productNameLink"
                            to={{
                              pathname: SINGLE_PRODUCT_ROUTE,
                              state: {
                                chosenProduct: product.id,
                                isLoggedIn: this.props.isLoggedIn,
                                email: this.props.email,
                                token: this.props.token,
                              },
                            }}
                          >
                            {product.name}
                          </Link>
                        </div>
                        <Link
                          className="startsFrom"
                          to={{
                            pathname: SINGLE_PRODUCT_ROUTE,
                            state: {
                              chosenProduct: product.id,
                              isLoggedIn: this.props.isLoggedIn,
                              email: this.props.email,
                              token: this.props.token,
                            },
                          }}
                        >
                          Starts from ${product.startPriceText}
                        </Link>
                      </div>
                    );
                  }.bind(this)
                )}
            </div>
          </div>
        </div>
      </InfiniteScroll>
    );
  }
}

export default TabsProducts;
