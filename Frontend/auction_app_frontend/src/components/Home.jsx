import { Tab } from "bootstrap";
import React, { Component } from "react";
import { Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
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
  };
  arrow = ">";
  categoryService = new CategoryService();
  productService = new ProductService();
  toastService = new ToastService();

  componentDidMount = async () => {
    try {
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
        newArrivals: await this.productService.getNewArrivals(),
      });
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  };

  handleTabSelect = async (key) => {
    if (key === "newArrivals") {
      /* this.setState({
        newArrivals: await this.productService.getNewArrivals(),
      });*/
    }
    if (key === "lastChance") {
      this.setState({
        lastChance: await this.productService.getLastChance(false),
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
                  ></CategoriesMenu>
                </div>
                <div className="col-lg-9 col-md-8 col-sm-8 mainProduct">
                  {this.state.product != null && (
                    <div className="row mainProductDiv">
                      <div className="col-lg-4  mainProductData">
                        <div className="mainProductName">
                          {this.state.product.name}
                        </div>
                        <div className="">
                          <div style={{ paddingRight: "0" }}>
                            <div className="mainProductPrice">
                              Starts from - ${this.state.product.startPrice}
                            </div>
                            <div className="mainProductDesc">
                              {this.state.product.description}
                            </div>
                            {this.props.isLoggedIn && (
                              <button className="mainBidButton">
                                BID NOW {this.arrow}{" "}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8 col-sm-12 image">
                        <img
                          className="mainProductImage"
                          src={`data:image/png;base64, ${this.state.product.imageList[0].image}`}
                        />
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
                    <TabsProducts array={this.state.newArrivals}></TabsProducts>
                  </Tab>
                  <Tab eventKey="lastChance" title="LastChance">
                    <TabsProducts array={this.state.lastChance}></TabsProducts>
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
