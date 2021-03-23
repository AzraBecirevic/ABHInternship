import styles from "./NavbarWhite.css";
import { Nav, Navbar } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import logo from "../assets/logo.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import React, { Component } from "react";
import {
  ABOUT_ROUTE,
  CATEGORIES_ROUTE,
  HOME_ROUTE,
  SINGLE_PRODUCT_ROUTE,
} from "../constants/routes";
import ProductService from "../services/productService";
import SearchResult from "./SearchResult";
import AboutUs from "./AboutUs";

export class NavbarWhite extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    productName: "",
    products: null,
  };

  productService = new ProductService();

  onChange = async (e) => {
    this.state.productName = e.target.value;

    this.setState({
      [e.target.name]: e.target.value,
    });

    if (this.state.productName.length <= 0) {
      this.props.history.push({
        pathname: CATEGORIES_ROUTE.replace(":productName", ":productName"),
        state: {
          chosenCategory: 0,
          isLoggedIn: this.props.isLoggedIn,
          email: this.props.email,
          token: this.props.token,
          productName: this.state.productName,
        },
      });
    } else {
      this.props.history.push({
        pathname: CATEGORIES_ROUTE.replace(
          ":productName",
          this.state.productName
        ),
        state: {
          chosenCategory: 0,
          isLoggedIn: this.props.isLoggedIn,
          email: this.props.email,
          token: this.props.token,
          productName: this.state.productName,
        },
      });
    }
  };

  closeDiv = () => {
    this.setState({ productName: "" });
  };

  render() {
    const { productName, products } = this.state;

    const { isLoggedIn, email, token } = this.props;

    return (
      <div>
        <div className="row navWhite">
          <div className="col-lg-2 col-md-0 col-sm-0 "></div>
          <div className="col-lg-8 col-md-12 col-sm-12 mainWhiteCol">
            <Navbar className="mainWhite">
              <Nav className="secondNav">
                <div className="row secondNavRow">
                  <div className="col-lg-3 col-md-4 col-sm-4  logoDiv">
                    <div className="heading">
                      <div className="headingInside">
                        <img className="logoImg" src={logo} alt="Logo" />

                        <Link to={HOME_ROUTE} className="homeLink">
                          AUCTION
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-4 col-sm-4 col-xs-12">
                    <div className="row searchBar" style={{ display: "flex" }}>
                      <input
                        type="text"
                        name="productName"
                        value={productName}
                        className="searchInput"
                        onChange={this.onChange}
                      ></input>

                      <div className="searchIconDiv">
                        <FontAwesomeIcon
                          className="searchIcon"
                          icon={faSearch}
                          size={"lg"}
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12 menuDiv">
                    <div className="menu">
                      <div className="menuDiv">
                        <Link to={HOME_ROUTE} className="menuItem">
                          HOME
                        </Link>
                        <Link
                          to={{
                            pathname: CATEGORIES_ROUTE,
                            state: {
                              chosenCategory: 0,
                              isLoggedIn: this.props.isLoggedIn,
                              email: this.props.email,
                              token: this.props.token,
                            },
                          }}
                          className="menuItem"
                        >
                          SHOP
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Nav>
            </Navbar>
          </div>
          <div className="col-lg-2 col-md-0 col-sm-0"></div>
        </div>
      </div>
    );
  }
}

export default NavbarWhite;
