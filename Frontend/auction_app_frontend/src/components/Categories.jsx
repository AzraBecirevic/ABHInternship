import React, { Component } from "react";
import CategoryService from "../services/categoryService";
import Heading from "./Heading";
import styles from "./Categories.css";
import { Link } from "react-router-dom";
import ProductService from "../services/productService";
import ToastService from "../services/toastService";
import InfiniteScroll from "react-infinite-scroll-component";
import { CATEGORIES_ROUTE, SINGLE_PRODUCT_ROUTE } from "../constants/routes";

export class Categories extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    categories: null,
    products: null,
    categoryId: null,
    hasMoreData: true,
    isLoggedIn: false,
    email: "",
    token: "",
    currentFetching: false,
  };

  categoryService = new CategoryService();
  productService = new ProductService();
  toastService = new ToastService();
  fetchNumber = 0;

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.location.state.chosenCategory !==
      this.props.location.state.chosenCategory
    ) {
      this.componentDidMount();
    }
  };

  componentDidMount = async () => {
    this.setState({ hasMoreData: true });
    this.fetchNumber = 1;
    try {
      const {
        chosenCategory,
        isLoggedIn,
        email,
        token,
      } = this.props.location.state;
      this.state.categoryId = chosenCategory;
      this.state.isLoggedIn = isLoggedIn;
      this.state.email = email;
      this.state.token = token;

      const productsDto = await this.productService.getProductsByCategoryId(
        this.state.categoryId,
        this.fetchNumber
      );

      this.setState({
        categories: await this.categoryService.getCategories(),
      });
      this.setState({
        products: productsDto.productsList,
        hasMoreData: productsDto.hasMoreData,
      });
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  exploreMore = async () => {
    if (this.state.hasMoreData) {
      this.setState({ currentFetching: true });
      this.fetchNumber = this.fetchNumber + 1;
      const moreProductsDto = await this.productService.getProductsByCategoryId(
        this.state.categoryId,
        this.fetchNumber
      );
      if (moreProductsDto != null && moreProductsDto.productsList != null) {
        this.setState({
          products: this.state.products.concat(moreProductsDto.productsList),
          hasMoreData: moreProductsDto.hasMoreData,
          currentFetching: false,
        });
      } else {
        this.setState({ hasMoreData: false, currentFetching: false });
      }
    }
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 categoriesColumn">
            <div className="categoriesDiv">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 categories">
                  <div className="categoriesMenu">
                    <p className="categoriesMenuHeading">PRODUCT CATEGORIES</p>
                    <div className="categoriesMenuList">
                      <ul className="categoriesList">
                        {this.state.categories != null &&
                          this.state.categories.map(
                            function (category) {
                              return (
                                <li className="categoryItem" key={category.id}>
                                  <Link
                                    className={
                                      "a " +
                                      (this.state.categoryId == category.id
                                        ? "linkCategoryActive"
                                        : " linkCategory")
                                    }
                                    to={{
                                      pathname: CATEGORIES_ROUTE,
                                      state: {
                                        chosenCategory: category.id,
                                        isLoggedIn: this.props.isLoggedIn,
                                        email: this.props.email,
                                        token: this.props.token,
                                      },
                                    }}
                                  >
                                    {category.name}
                                  </Link>
                                </li>
                              );
                            }.bind(this)
                          )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 col-md-8 col-sm-12 categories">
                  {this.state.products != null &&
                    this.state.products.length > 0 && (
                      <InfiniteScroll
                        dataLength={
                          this.state.products == null
                            ? 0
                            : this.state.products.length
                        }
                        next={this.exploreMore}
                        hasMore={this.state.hasMoreData}
                        loader={
                          this.state.currentFetching && (
                            <p className="infLoadingMessage">Loading...</p>
                          )
                        }
                        endMessage={
                          <p className="infErrorMessage">
                            <b>There are no more products to show.</b>
                          </p>
                        }
                      >
                        <div className="row">
                          {this.state.products != null &&
                            this.state.products.map(
                              function (product) {
                                return (
                                  <div
                                    className="col-lg-4 col-md-6 col-sm-6 product"
                                    key={product.id}
                                  >
                                    <Link
                                      to={{
                                        pathname: SINGLE_PRODUCT_ROUTE,
                                        state: {
                                          chosenProduct: product.id,
                                          isLoggedIn: this.state.isLoggedIn,
                                          email: this.state.email,
                                          token: this.state.token,
                                        },
                                      }}
                                    >
                                      <img
                                        className="categoryProductImage"
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
                                            isLoggedIn: this.state.isLoggedIn,
                                            email: this.state.email,
                                            token: this.state.token,
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
                                          isLoggedIn: this.state.isLoggedIn,
                                          email: this.state.email,
                                          token: this.state.token,
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
                      </InfiniteScroll>
                    )}
                  {(this.state.products == null ||
                    this.state.products.length <= 0) && (
                    <div className="infErrorMessage">
                      There are no products in this category.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    );
  }
}

export default Categories;
