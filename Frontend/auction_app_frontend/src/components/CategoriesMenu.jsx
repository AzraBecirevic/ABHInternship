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
              this.props.categories.map(
                function (category, index) {
                  return (
                    <li
                      className={
                        index == this.props.categories.length - 1
                          ? "menuAllCategoriesItem"
                          : "menuCategoriesItem"
                      }
                      key={category.id}
                    >
                      <Link
                        className="categoryLink"
                        to={{
                          pathname: CATEGORIES_ROUTE.replace(
                            ":categories",
                            `${category.id}-${category.name}`
                          ),
                          state: {
                            chosenCategory: category.id,
                            isLoggedIn: this.props.isLoggedIn,
                            email: this.props.email,
                            token: this.props.token,
                            categoryName: category.name,
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
    );
  }
}

export default CategoriesMenu;
