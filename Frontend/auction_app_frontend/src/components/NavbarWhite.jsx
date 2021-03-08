import styles from "./NavbarWhite.css";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import React, { Component } from "react";
import { HOME_ROUTE, SINGLE_PRODUCT_ROUTE } from "../constants/routes";
import ProductService from "../services/productService";
import SearchResult from "./SearchResult";

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

    if (e.target.value == null || e.target.value == "") {
      return;
    }
    if (e.target.value.length > 50) {
      this.setState({ products: [] });
    }

    this.setState({
      products: await this.productService.getProductByName(
        this.state.productName
      ),
    });
  };

  closeDiv = () => {
    this.setState({ productName: "" });
  };

  render() {
    const { productName, products } = this.state;

    return (
      <div>
        <Navbar className="mainWhite">
          <div className="row navWhite">
            <div className="col-lg-2 col-md-0 col-sm-0 "></div>
            <div className="col-lg-8 col-md-12 col-sm-12">
              <Nav className="secondNav">
                <div className="row secondNavRow">
                  <div className="col-lg-3 col-md-4 col-sm-4  logoDiv">
                    <div className="heading">
                      <img className="logoImg" src={logo} alt="Logo" />
                      <Link to={HOME_ROUTE} className="homeLink">
                        AUCTION
                      </Link>
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
                      </div>
                    </div>
                  </div>
                </div>
              </Nav>
            </div>
            <div className="col-lg-2 col-md-0 col-sm-0"></div>
          </div>
        </Navbar>
        <SearchResult
          productName={productName}
          products={products}
          closeSerchDiv={this.closeDiv}
        ></SearchResult>
      </div>
    );
  }
}

export default NavbarWhite;
