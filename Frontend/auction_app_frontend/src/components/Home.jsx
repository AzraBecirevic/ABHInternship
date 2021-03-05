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
  };
  arrow = ">";
  categoryService = new CategoryService();
  productService = new ProductService();
  toastService = new ToastService();
  fetchNumber = 0;

  componentDidMount = async () => {
    try {
      this.fetchNumber = 1;
      this.setState({ product: await this.productService.getProduct() });
      this.setState({
        categories: await this.categoryService.getCategories(),
      });
      // takes only first nine categories, if length > 9
      if (this.state.categories != null && this.state.categories.length > 9) {
        this.setState({ categories: this.state.categories.slice(0, 8) });
      }
      this.setState({ products: await this.productService.getProducts() });

      this.setState({
        newArrivals: await this.productService.getNewArrivals(1),
      });
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  fetchMoreNewArrivals = async () => {
    try {
      if (this.state.isNewArrivalsTab && this.state.newArrivals != null) {
        this.fetchNumber = this.fetchNumber + 1;
        const newProducts = await this.productService.getNewArrivals(
          this.fetchNumber
        );

        if (newProducts !== null && newProducts.length > 0) {
          this.setState({
            newArrivals: this.state.newArrivals.concat(newProducts),
          });
        } else {
          this.setState({ hasMoreNewArrivalsData: false });
        }
      }
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  fetchMoreLastChance = async () => {
    try {
      if (!this.state.isNewArrivalsTab && this.state.lastChance != null) {
        this.fetchNumber = this.fetchNumber + 1;
        const lastChanceProducts = await this.productService.getLastChance(
          this.fetchNumber
        );

        if (lastChanceProducts !== null && lastChanceProducts.length > 0) {
          this.setState({
            lastChance: this.state.lastChance.concat(lastChanceProducts),
          });
        } else {
          this.setState({ hasMoreLastChanceData: false });
        }
      }
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  handleTabSelect = async (key) => {
    if (key === "newArrivals") {
      this.fetchNumber = 1;
      this.setState({
        isNewArrivalsTab: true,
        hasMoreNewArrivalsData: true,
        newArrivals: await this.productService.getNewArrivals(1),
      });
    }
    if (key === "lastChance") {
      this.fetchNumber = 1;
      this.setState({
        isNewArrivalsTab: false,
        hasMoreLastChanceData: true,
        lastChance: await this.productService.getLastChance(1),
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
