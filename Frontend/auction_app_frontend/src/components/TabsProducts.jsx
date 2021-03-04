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
                        <img
                          className="tabProductImage"
                          src={`data:image/png;base64, ${product.image}`}
                        />

                        <div>
                          <Link
                            className="productNameLink"
                            to={{
                              pathname: SINGLE_PRODUCT_ROUTE,
                              state: {
                                chosenProduct: product.id,
                                isLoggedIn: this.props.isLoggedIn,
                              },
                            }}
                          >
                            {product.name}
                          </Link>
                        </div>
                        <div className="startsFrom">
                          Starts from ${product.startPrice}
                        </div>
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
