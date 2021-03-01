import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES_ROUTE } from "../constants/routes";
import styles from "./CategoriesMenu.css";

export class CategoriesMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="homeHeadingMenu">
        <p className="homeHeadingMenuHeading">CATEGORIES</p>
        <div className="menuCategories">
          <ul className="menucategoriesList">
            {this.props.categories != null &&
              this.props.categories.map(function (category) {
                return (
                  <li className="menuCategoriesItem" key={category.id}>
                    <Link
                      className="categoryLink"
                      to={{
                        pathname: CATEGORIES_ROUTE,
                        state: {
                          chosenCategory: category.id,
                        },
                      }}
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            <li className="menuCategoriesItem">
              <a className="categoryLink">All categories</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CategoriesMenu;
