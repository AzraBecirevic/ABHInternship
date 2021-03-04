import React, { Component } from "react";
import CategoryService from "../services/categoryService";
import Heading from "./Heading";
import styles from "./Categories.css";
import { Link } from "react-router-dom";
import ProductService from "../services/productService";
import ToastService from "../services/toastService";
import InfiniteScroll from "react-infinite-scroll-component";
import { SINGLE_PRODUCT_ROUTE } from "../constants/routes";

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
  };

  categoryService = new CategoryService();
  productService = new ProductService();
  toastService = new ToastService();
  fetchNumber = 0;

  componentDidMount = async () => {
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

      this.setState({
        categories: await this.categoryService.getCategories(),
      });
      this.setState({
        products: await this.productService.getProductsByCategoryId(
          this.state.categoryId,
          this.fetchNumber
        ),
      });
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  handleCategoryChange = async (categoryID) => {
    this.fetchNumber = 1;
    const productsList = await this.productService.getProductsByCategoryId(
      categoryID,
      this.fetchNumber
    );
    this.setState({
      products: productsList,
      categoryId: categoryID,
      hasMoreData: true,
    });
  };

  exploreMore = async () => {
    if (this.state.products != null) {
      this.fetchNumber = this.fetchNumber + 1;
      const moreProducts = await this.productService.getProductsByCategoryId(
        this.state.categoryId,
        this.fetchNumber
      );
      if (moreProducts != null && moreProducts.length > 0) {
        this.setState({
          products: this.state.products.concat(moreProducts),
        });
      } else {
        this.setState({ hasMoreData: false });
      }
    }
  };

  render() {
    return (
      <div>
        <Heading title=""></Heading>
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
                                  <a
                                    className={
                                      "a " +
                                      (this.state.categoryId == category.id
                                        ? "linkCategoryActive"
                                        : " linkCategory")
                                    }
                                    onClick={(e) =>
                                      this.handleCategoryChange(category.id)
                                    }
                                  >
                                    {category.name}
                                  </a>
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
                        loader={<p className="infLoadingMessage">Loading...</p>}
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
                                      Starts from ${product.startPrice}
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
