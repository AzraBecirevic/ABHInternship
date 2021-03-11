import { Tab } from "bootstrap";
import React, { Component } from "react";
import { Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SINGLE_PRODUCT_ROUTE } from "../constants/routes";
import CategoryService from "../services/categoryService";
import ProductService from "../services/productService";
import ToastService from "../services/toastService";
import CategoriesMenu from "./CategoriesMenu";
import styles from "./Home.css";
import TabsProducts from "./TabsProducts";

export class Home extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    categories: null,
    product: null,
    products: null,
    newArrivals: null,
    lastChance: null,
    hasMoreNewArrivalsData: true,
    hasMoreLastChanceData: true,
    isNewArrivalsTab: true,
    fetchNumber: 1,
    currentFetchnigNewArrivals: false,
    currentFetchnigLastChance: false,
  };
  arrow = ">";
  categoryService = new CategoryService();
  productService = new ProductService();
  toastService = new ToastService();
  fetchNumber = 0;

  componentDidMount = async () => {
    try {
      const newArrivalsDto = await this.productService.getNewArrivals(1); //?

      this.fetchNumber = 1;
      this.setState({ product: await this.productService.getProduct() });
      this.setState({
        categories: await this.categoryService.getCategories(),
      });
      if (this.state.categories != null && this.state.categories.length > 9) {
        this.setState({ categories: this.state.categories.slice(0, 10) });
      }
      this.setState({ products: await this.productService.getProducts() });

      this.setState({
        newArrivals: newArrivalsDto.productsList,
        hasMoreNewArrivalsData: newArrivalsDto.hasMoreData,
      });
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  fetchMoreNewArrivals = async () => {
    try {
      if (this.state.hasMoreNewArrivalsData) {
        this.setState({ currentFetchnigNewArrivals: true });
        this.fetchNumber = this.fetchNumber + 1;
        const newProductsDto = await this.productService.getNewArrivals(
          this.fetchNumber
        );

        if (newProductsDto !== null && newProductsDto.productsList != null) {
          this.setState({
            newArrivals: this.state.newArrivals.concat(
              newProductsDto.productsList
            ),
            hasMoreNewArrivalsData: newProductsDto.hasMoreData,
            currentFetchnigNewArrivals: false,
          });
        } else {
          this.setState({
            hasMoreNewArrivalsData: false,
            currentFetchnigNewArrivals: false,
          });
        }
      }
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  fetchMoreLastChance = async () => {
    try {
      if (this.hasMoreLastChanceData) {
        this.setState({ currentFetchnigLastChance: true });
        this.fetchNumber = this.fetchNumber + 1;
        const lastChanceProducts = await this.productService.getLastChance(
          this.fetchNumber
        );

        if (
          lastChanceProducts !== null &&
          lastChanceProducts.productsList != null
        ) {
          this.setState({
            lastChance: this.state.lastChance.concat(
              lastChanceProducts.productsList
            ),
            hasMoreLastChanceData: lastChanceProducts.hasMoreData,
            currentFetchnigLastChance: false,
          });
        } else {
          this.setState({
            hasMoreLastChanceData: false,
            currentFetchnigLastChance: false,
          });
        }
      }
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  handleTabSelect = async (key) => {
    if (key === "newArrivals") {
      const newArrivalsDto = await this.productService.getNewArrivals(1);
      this.fetchNumber = 1;
      this.setState({
        isNewArrivalsTab: true,
        hasMoreNewArrivalsData: newArrivalsDto.hasMoreData,
        newArrivals: newArrivalsDto.productsList,
      });
    }
    if (key === "lastChance") {
      const lastChanceDto = await this.productService.getLastChance(1);
      this.fetchNumber = 1;
      this.setState({
        isNewArrivalsTab: false,
        hasMoreLastChanceData: lastChanceDto.hasMoreData,
        lastChance: lastChanceDto.productsList,
      });
    }
  };

  render() {
    return (
      <div className="homeDiv">
        <div className="homeHeadingDiv">
          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <div className="row headingrow">
                <div className="col-lg-3 col-md-4 col-sm-4 homemenu">
                  <CategoriesMenu
                    categories={this.state.categories}
                    isLoggedIn={this.props.isLoggedIn}
                    email={this.props.email}
                    token={this.props.token}
                  ></CategoriesMenu>
                </div>
                <div className="col-lg-9 col-md-8 col-sm-8 mainProduct">
                  {this.state.product != null && (
                    <div className="row mainProductDiv">
                      <div className="col-lg-4  mainProductData">
                        <Link
                          className="mainProductName"
                          to={{
                            pathname: SINGLE_PRODUCT_ROUTE,
                            state: {
                              chosenProduct: this.state.product.id,
                              isLoggedIn: this.props.isLoggedIn,
                              email: this.props.email,
                              token: this.props.token,
                            },
                          }}
                        >
                          {this.state.product.name}
                        </Link>
                        <div className="">
                          <div style={{ paddingRight: "0" }}>
                            <Link
                              className="mainProductPrice"
                              to={{
                                pathname: SINGLE_PRODUCT_ROUTE,
                                state: {
                                  chosenProduct: this.state.product.id,
                                  isLoggedIn: this.props.isLoggedIn,
                                  email: this.props.email,
                                  token: this.props.token,
                                },
                              }}
                            >
                              Starts from - ${this.state.product.startPriceText}
                            </Link>
                            <div className="mainProductDesc">
                              {this.state.product.description}
                            </div>
                            {this.props.isLoggedIn && (
                              <Link
                                to={{
                                  pathname: SINGLE_PRODUCT_ROUTE,
                                  state: {
                                    chosenProduct: this.state.product.id,
                                    isLoggedIn: this.props.isLoggedIn,
                                    email: this.props.email,
                                    token: this.props.token,
                                  },
                                }}
                              >
                                <button className="mainBidButton">
                                  BID NOW {this.arrow}{" "}
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8 col-sm-12 image">
                        <Link
                          to={{
                            pathname: SINGLE_PRODUCT_ROUTE,
                            state: {
                              chosenProduct: this.state.product.id,
                              isLoggedIn: this.props.isLoggedIn,
                              email: this.props.email,
                              token: this.props.token,
                            },
                          }}
                        >
                          <img
                            className="mainProductImage"
                            src={`data:image/png;base64, ${this.state.product.imageList[0].image}`}
                          />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>

        <div className="homeBodyDiv">
          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <div className="homeTabsDiv">
                <Tabs
                  defaultActiveKey="newArrivals"
                  onSelect={this.handleTabSelect}
                >
                  <Tab eventKey="newArrivals" title="New Arrivals">
                    <TabsProducts
                      array={this.state.newArrivals}
                      fetchMore={this.fetchMoreNewArrivals}
                      hasMore={this.state.hasMoreNewArrivalsData}
                      isLoggedIn={this.props.isLoggedIn}
                      email={this.props.email}
                      token={this.props.token}
                      currentFetchnig={this.state.currentFetchnigNewArrivals}
                    ></TabsProducts>
                  </Tab>
                  <Tab eventKey="lastChance" title="Last Chance">
                    <TabsProducts
                      array={this.state.lastChance}
                      fetchMore={this.fetchMoreLastChance}
                      hasMore={this.state.hasMoreLastChanceData}
                      isLoggedIn={this.props.isLoggedIn}
                      email={this.props.email}
                      token={this.props.token}
                      currentFetchnig={this.state.currentFetchnigLastChance}
                    ></TabsProducts>
                  </Tab>
                </Tabs>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
