import React, { Component } from "react";
import CategoryService from "../services/categoryService";
import Heading from "./Heading";
import styles from "./Categories.css";
import { Link } from "react-router-dom";
import ProductService from "../services/productService";

export class Categories extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    categories: null,
    products: null,
    categoryId: null,
  };

  categoryService = new CategoryService();
  productService = new ProductService();

  componentDidMount = async () => {
    const { chosenCategory } = this.props.location.state;
    this.state.categoryId = chosenCategory;
    this.setState({
      categories: await this.categoryService.getCategories(false),
    });
    this.setState({
      products: await this.productService.getProductsByCategoryId(
        true,
        this.state.categoryId
      ),
    });
  };

  handleCategoryChange = async (categoryID) => {
    this.setState({
      products: await this.productService.getProductsByCategoryId(
        false,
        categoryID
      ),
    });
  };

  render() {
    return (
      <div>
        <Heading title=""></Heading>
        <div className="categoriesDiv">
          <div className="row">
            <div className="col-lg-4">
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
                                className="linkCategory"
                                onClick={() =>
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
            <div className="col-lg-8">
              <div className="row">
                {this.state.products != null &&
                  this.state.products.map(function (product) {
                    return (
                      <div className="col-lg-6" key={product.id}>
                        <img
                          className="categoryProductImage"
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Categories;
