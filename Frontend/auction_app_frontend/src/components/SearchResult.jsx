import React, { Component } from "react";
import { Link } from "react-router-dom";
import { SINGLE_PRODUCT_ROUTE } from "../constants/routes";

export class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
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

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeSerchDiv();
    }
  }

  render() {
    const { productName, products } = this.props;
    return (
      <div
        ref={this.setWrapperRef}
        className="row searchResultRow"
        hidden={productName === "" || productName === null}
      >
        <div className="col-lg-2 col-sm-0"></div>
        <div className="col-lg-8 col-sm-12">
          <div className="row searchResultColRow">
            <div className="col-lg-3 col-sm-3 col-xs-0"></div>
            <div className="col-lg-6 col-sm-6 col-xs-12 searchResult">
              <div className="row searchResultDiv">
                <div className="saerchResultListDiv">
                  <ul className="searchProductResultList">
                    {" "}
                    {products !== null &&
                      products.length > 0 &&
                      products.map(
                        function (product, index) {
                          return (
                            <li key={index} className="searchProductListItem">
                              <Link
                                className="searchProductLink"
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
                                <div className="row serchResultProductRow">
                                  <img
                                    className="searchProductImage"
                                    src={`data:image/png;base64, ${product.image}`}
                                  />

                                  <div className="searchProductName">
                                    {product.name}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          );
                        }.bind(this)
                      )}
                  </ul>

                  {(products === null || products.length <= 0) && (
                    <div>
                      <div className="searchNoProducts">
                        There are no products with matching name
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-3 col-xs-0"></div>
          </div>
        </div>
        <div className="col-lg-2 col-sm-0"></div>
      </div>
    );
  }
}

export default SearchResult;
