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

  componentDidMount = async () => {
    this.setState({ product: await this.productService.getProduct(true) });
    this.setState({
      categories: await this.categoryService.getCategories(false),
    });
    // takes only first nine categories, if length > 9
    if (this.state.categories != null && this.state.categories.length > 9) {
      this.setState({ categories: this.state.categories.slice(0, 8) });
    }
    this.setState({ products: await this.productService.getProducts(false) });

    this.setState({
      newArrivals: await this.productService.getNewArrivals(false),
    });
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
            <div className="col-lg-4">
              <CategoriesMenu
                categories={this.state.categories}
              ></CategoriesMenu>
            </div>
            <div className="col-lg-8">
              {this.state.product != null && (
                <div style={{ marginTop: "133px" }}>
                  <div className="mainProductName">
                    {this.state.product.name}
                  </div>
                  <div className="row">
                    <div className="col-lg-5" style={{ paddingRight: "0" }}>
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
                    <div className="col-lg-6" style={{ paddingLeft: "0" }}>
                      <img
                        className="mainProductImage"
                        src={`data:image/png;base64, ${this.state.product.imageList[0].image}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="homeBodyDiv">
          <div className="row">
            {this.state.products != null &&
              this.state.products.map(function (product) {
                return (
                  <div
                    className="col-lg-4"
                    key={product.id}
                    style={{ marginTop: "40px" }}
                  >
                    <img
                      className="homeProductImage"
                      src={`data:image/png;base64, ${product.image}`}
                    />
                    <div>
                      <a className="productNameLink">{product.name}</a>
                    </div>
                    <div className="startsFrom">
                      Starts from ${product.startPrice}
                    </div>
                  </div>
                );
              })}
          </div>
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
      </div>
    );
  }
}

export default Home;
