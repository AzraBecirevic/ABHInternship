import React, { Component } from "react";
import CategoryService from "../services/categoryService";
import Heading from "./Heading";
import styles from "./Categories.css";
import { Link } from "react-router-dom";
import ProductService from "../services/productService";
import ToastService from "../services/toastService";
import InfiniteScroll from "react-infinite-scroll-component";
import { CATEGORIES_ROUTE, SINGLE_PRODUCT_ROUTE } from "../constants/routes";
import {
  CONNECTION_REFUSED_MESSAGE,
  NO_MORE_PRODUCTS_MESSAGE,
  START_CHOSING_FILTERS,
  NO_PRODUCTS_IN_CATEGORY_MESSAGE,
  LOADING_PRODUCTS_MESSAGE,
  PRICE_FILTER_HEADING,
  CATEGORY_MENU_HEADING,
  MAX_ALLOWED_BID_PRICE,
  AVERAGE_PRICE_MESSAGE,
  NO_PRODUCTS_IN_PRICE_RANGE,
} from "../constants/messages";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubcategoryService from "../services/subcategoryService";
import FilteredProducts from "../model/FilteredProducts";
import {
  CATEGORY_TYPE,
  SEARCH_PRODUCT_TYPE,
  SUBCATEGORY_TYPE,
} from "../constants/types";
import { Grid, Slider, Typography } from "@material-ui/core";

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
    currentFetching: false,
    clickedCategory: 0,
    subcategories: null,
    filterTags: [],
    min: 0,
    max: 1000,
    minText: "",
    maxText: "",
    averagePriceText: "",
  };

  categoryService = new CategoryService();
  productService = new ProductService();
  toastService = new ToastService();
  subcategoryService = new SubcategoryService();
  fetchNumber = 0;

  filteredProducts = new FilteredProducts();

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.location.state.chosenCategory !==
        this.props.location.state.chosenCategory ||
      prevProps.location.state.productName !==
        this.props.location.state.productName
    ) {
      this.componentDidMount();
    }
  };

  componentDidMount = async () => {
    this.fetchNumber = 1;
    try {
      const {
        chosenCategory,
        isLoggedIn,
        email,
        token,
        productName,
        categoryName,
      } = this.props.location.state;
      this.state.categoryId = chosenCategory;
      this.state.isLoggedIn = isLoggedIn;
      this.state.email = email;
      this.state.token = token;

      this.setIsLoading(true);

      var productsDto = null;

      if (this.state.categoryId > 0) {
        this.filteredProducts.categoryIds.push(this.state.categoryId);
        this.setState({
          filterTags: [
            ...this.state.filterTags,
            {
              id: this.state.categoryId,
              name: categoryName,
              type: CATEGORY_TYPE,
            },
          ],
        });
      }

      this.filteredProducts.productName = productName;

      productsDto = await this.productService.getFilteredProducts(
        this.filteredProducts,
        this.fetchNumber
      );

      const categoriesList = await this.categoryService.getCategories();

      const priceFilterData = await this.productService.getPriceFilterData();

      this.setState({
        products: productsDto.productsList,
        hasMoreData: productsDto == null ? false : productsDto.hasMoreData,
        categories: categoriesList,
        min: priceFilterData.minPrice,
        max: priceFilterData.maxPrice,
        minText: priceFilterData.minPriceText,
        maxText: priceFilterData.maxPriceText,
        averagePriceText: priceFilterData.averagePriceText,
      });

      this.setIsLoading(false);
    } catch (error) {
      this.setIsLoading(false);
      this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
    }
  };

  setIsLoading = (isLoadingValue) => {
    this.props.setIsLoading(isLoadingValue);
  };

  exploreMore = async () => {
    if (this.state.hasMoreData) {
      this.setState({ currentFetching: true });
      this.fetchNumber = this.fetchNumber + 1;
      const moreProductsDto = await this.productService.getFilteredProducts(
        this.filteredProducts,
        this.fetchNumber
      );
      if (
        moreProductsDto != null &&
        moreProductsDto.productsList != null &&
        this.state.products != null
      ) {
        this.setState({
          products: this.state.products.concat(moreProductsDto.productsList),
          hasMoreData: moreProductsDto.hasMoreData,
          currentFetching: false,
        });
      } else {
        this.setState({ hasMoreData: false, currentFetching: false });
      }
    }
  };

  showSubcategories = async (categoryId) => {
    const subcategoriesList = await this.subcategoryService.getSubcategoriesByCategoryId(
      categoryId
    );
    this.setState({
      subcategories: subcategoriesList,
      clickedCategory: categoryId,
    });
  };

  closeSubcategories = () => {
    this.setState({
      subcategories: null,
      clickedCategory: 0,
    });
  };

  removeSubcategoryFiltersAndTags = (subcategoryList) => {
    var subcategoryIdRemove = [];
    var filterTagsToRemove = [];

    for (let i = 0; i < subcategoryList.length; i++) {
      for (let j = 0; j < this.filteredProducts.subcategoryIds.length; j++) {
        if (subcategoryList[i].id == this.filteredProducts.subcategoryIds[j]) {
          subcategoryIdRemove.push(this.filteredProducts.subcategoryIds[j]);
        }
      }
      for (let k = 0; k < this.state.filterTags.length; k++) {
        if (
          subcategoryList[i].id == this.state.filterTags[k].id &&
          this.state.filterTags[k].type == SUBCATEGORY_TYPE
        ) {
          filterTagsToRemove.push(this.state.filterTags[k]);
        }
      }
    }

    for (let i = 0; i < subcategoryIdRemove.length; i++) {
      this.filteredProducts.subcategoryIds = this.filteredProducts.subcategoryIds.filter(
        function (id) {
          return id != subcategoryIdRemove[i];
        }
      );
    }

    for (let i = 0; i < filterTagsToRemove.length; i++) {
      this.removeFilter(filterTagsToRemove[i]);
    }
  };

  checkIfCategoryIsAlreadyFiltered = (categoryId) => {
    for (let i = 0; i < this.filteredProducts.categoryIds.length; i++) {
      if (this.filteredProducts.categoryIds[i] == categoryId) {
        return true;
      }
    }
  };

  categoryChosen = async (categoryId, subcategoryList, categoryName) => {
    if (this.checkIfCategoryIsAlreadyFiltered(categoryId)) {
      return;
    }
    this.removeSubcategoryFiltersAndTags(subcategoryList);

    this.filteredProducts.categoryIds.push(categoryId);

    this.fetchNumber = 1;

    var productsDto = await this.productService.getFilteredProducts(
      this.filteredProducts,
      this.fetchNumber
    );

    this.setState({
      products: productsDto.productsList,
      hasMoreData: productsDto.hasMoreData,
      filterTags: [
        ...this.state.filterTags,
        { id: categoryId, name: categoryName, type: CATEGORY_TYPE },
      ],
    });
  };

  checkIfSubcategoryIsAlreadyFiltered = (subcategoryId) => {
    for (let i = 0; i < this.filteredProducts.subcategoryIds.length; i++) {
      if (this.filteredProducts.subcategoryIds[i] == subcategoryId) {
        return true;
      }
    }
  };

  removeCategoryFiltersAndTags = (categoryId) => {
    this.filteredProducts.categoryIds = this.filteredProducts.categoryIds.filter(
      function (id) {
        return id !== categoryId;
      }
    );

    var filterTag = null;
    for (let i = 0; i < this.state.filterTags.length; i++) {
      if (
        this.state.filterTags[i].id == categoryId &&
        this.state.filterTags[i].type == CATEGORY_TYPE
      ) {
        filterTag = this.state.filterTags[i];
      }
    }
    if (filterTag != null) {
      this.removeFilter(filterTag);
    }
  };

  subcategoryChosen = async (subcategoryId, categoryId, subcategoryName) => {
    if (this.checkIfSubcategoryIsAlreadyFiltered(subcategoryId)) {
      return;
    }
    this.filteredProducts.subcategoryIds.push(subcategoryId);

    this.removeCategoryFiltersAndTags(categoryId);

    this.fetchNumber = 1;

    var productsDto = await this.productService.getFilteredProducts(
      this.filteredProducts,
      this.fetchNumber
    );

    this.setState({
      products: productsDto.productsList,
      hasMoreData: productsDto.hasMoreData,
      filterTags: [
        ...this.state.filterTags,
        { id: subcategoryId, name: subcategoryName, type: SUBCATEGORY_TYPE },
      ],
    });
  };

  removeFilter = async (filterTag) => {
    if (filterTag.type == CATEGORY_TYPE) {
      this.filteredProducts.categoryIds = this.filteredProducts.categoryIds.filter(
        function (id) {
          return id != filterTag.id;
        }
      );
      if (this.state.categoryId != 0) {
        this.state.categoryId = 0;
      }
    } else if (filterTag.type == SUBCATEGORY_TYPE) {
      this.filteredProducts.subcategoryIds = this.filteredProducts.subcategoryIds.filter(
        function (id) {
          return id != filterTag.id;
        }
      );
    }

    this.fetchNumber = 1;

    var productsDto = await this.productService.getFilteredProducts(
      this.filteredProducts,
      this.fetchNumber
    );

    this.setState({
      filterTags: this.state.filterTags.filter(function (fTag) {
        return fTag != filterTag;
      }),
      products: productsDto.productsList,
      hasMoreData: productsDto.hasMoreData,
    });
  };

  changePriceFilter = async (value) => {
    this.filteredProducts.minPrice = value[0];
    this.filteredProducts.maxPrice = value[1];

    this.fetchNumber = 1;

    var productsDto = await this.productService.getFilteredProducts(
      this.filteredProducts,
      this.fetchNumber
    );

    this.setState({
      products: productsDto.productsList,
      hasMoreData: productsDto.hasMoreData,
    });
  };

  render() {
    const {
      categories,
      clickedCategory,
      subcategories,
      min,
      max,
      minText,
      maxText,
      averagePriceText,
      filterTags,
      categoryId,
      products,
      hasMoreData,
      currentFetching,
      isLoggedIn,
      email,
      token,
    } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 categoriesColumn">
            <div className="categoriesDiv">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 categories">
                  <div className="categoriesMenu">
                    <p className="categoriesMenuHeading">
                      {CATEGORY_MENU_HEADING}
                    </p>
                    <div className="categoriesMenuList">
                      <ul className="categoriesList">
                        {categories != null &&
                          categories.map(
                            function (category) {
                              return (
                                <li className="categoryItem" key={category.id}>
                                  <div className="categoryItemDiv">
                                    {" "}
                                    <a
                                      className="linkCategory"
                                      onClick={() =>
                                        this.categoryChosen(
                                          category.id,
                                          category.subcategoryList,
                                          category.name
                                        )
                                      }
                                    >
                                      {category.name}
                                    </a>
                                    {clickedCategory != category.id && (
                                      <FontAwesomeIcon
                                        onClick={() =>
                                          this.showSubcategories(category.id)
                                        }
                                        style={{ color: "#252525" }}
                                        icon={faPlus}
                                        size={"lg"}
                                      ></FontAwesomeIcon>
                                    )}
                                    {clickedCategory == category.id && (
                                      <FontAwesomeIcon
                                        onClick={() =>
                                          this.closeSubcategories()
                                        }
                                        style={{ color: "#252525" }}
                                        icon={faMinus}
                                        size={"lg"}
                                      ></FontAwesomeIcon>
                                    )}
                                  </div>
                                  {clickedCategory == category.id && (
                                    <div className="subcategoriesDiv">
                                      <ul className="subcategoriesList">
                                        {subcategories != null &&
                                          subcategories.map(
                                            function (subcategory) {
                                              return (
                                                <li
                                                  className="subcategoriesListItem"
                                                  key={subcategory.id}
                                                >
                                                  <a
                                                    className="subcategoryItemLink"
                                                    onClick={() =>
                                                      this.subcategoryChosen(
                                                        subcategory.id,
                                                        subcategory.categoryId,
                                                        subcategory.name
                                                      )
                                                    }
                                                  >
                                                    {subcategory.name} (
                                                    {
                                                      subcategory.numberOfProducts
                                                    }
                                                    )
                                                  </a>
                                                </li>
                                              );
                                            }.bind(this)
                                          )}
                                      </ul>
                                    </div>
                                  )}
                                </li>
                              );
                            }.bind(this)
                          )}
                      </ul>
                    </div>
                  </div>
                  <div className="priceFilter">
                    <div className="priceFilterHeading">
                      {PRICE_FILTER_HEADING}
                    </div>
                    <div>
                      {" "}
                      <Grid
                        container
                        justify="center"
                        style={{ marginTop: "33px" }}
                      >
                        <Grid item xs={12} lg={8}>
                          <Typography id="range-slider" gutterBottom>
                            graph
                          </Typography>
                          <Slider
                            min={min}
                            max={max}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            defaultValue={[0, 300]}
                            onChange={(e, val) => {
                              this.changePriceFilter(val);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                    <div className="priceFilterDetails">
                      <div>
                        ${minText}-${maxText}
                      </div>
                      <div>
                        {" "}
                        {AVERAGE_PRICE_MESSAGE}
                        {averagePriceText}
                        {}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 col-md-8 col-sm-12 categories">
                  <div className="filterTagsDiv">
                    {filterTags != null &&
                      filterTags.length > 0 &&
                      filterTags.map(
                        function (filterTag, index) {
                          return (
                            <div className="filterTagBox" key={index}>
                              {filterTag.name}
                              <FontAwesomeIcon
                                onClick={() => {
                                  this.removeFilter(filterTag);
                                }}
                                style={{ color: "#ffffff" }}
                                icon={faTimesCircle}
                                size={"lg"}
                              ></FontAwesomeIcon>
                            </div>
                          );
                        }.bind(this)
                      )}
                  </div>
                  {categoryId == 0 &&
                    (products == null || products.length == 0) &&
                    this.filteredProducts.categoryIds.length <= 0 &&
                    this.filteredProducts.subcategoryIds <= 0 && (
                      <div className="infErrorMessage">
                        {START_CHOSING_FILTERS}
                      </div>
                    )}
                  {(this.filteredProducts.categoryIds.length > 0 ||
                    this.filteredProducts.subcategoryIds > 0) &&
                    (this.filteredProducts.minPrice != -1 ||
                      this.filteredProducts.maxPrice != -1) &&
                    (products == null || products.length == 0) && (
                      <div className="infErrorMessage">
                        {NO_PRODUCTS_IN_PRICE_RANGE}
                      </div>
                    )}
                  {products != null && products.length > 0 && (
                    <InfiniteScroll
                      dataLength={products == null ? 0 : products.length}
                      next={this.exploreMore}
                      hasMore={hasMoreData}
                      loader={
                        currentFetching && (
                          <p className="infLoadingMessage">
                            {LOADING_PRODUCTS_MESSAGE}
                          </p>
                        )
                      }
                      endMessage={
                        <p className="infErrorMessage">
                          <b>{NO_MORE_PRODUCTS_MESSAGE}</b>
                        </p>
                      }
                    >
                      <div className="row">
                        {products != null &&
                          products.map(
                            function (product, index) {
                              return (
                                <div
                                  className="col-lg-4 col-md-6 col-sm-6 product"
                                  key={index}
                                >
                                  <Link
                                    to={{
                                      pathname: SINGLE_PRODUCT_ROUTE.replace(
                                        ":prodId",
                                        product.id
                                      ),
                                      state: {
                                        chosenProduct: product.id,
                                        isLoggedIn: isLoggedIn,
                                        email: email,
                                        token: token,
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
                                        pathname: SINGLE_PRODUCT_ROUTE.replace(
                                          ":prodId",
                                          product.id
                                        ),
                                        state: {
                                          chosenProduct: product.id,
                                          isLoggedIn: isLoggedIn,
                                          email: email,
                                          token: token,
                                        },
                                      }}
                                    >
                                      {product.name}
                                    </Link>
                                  </div>
                                  <Link
                                    className="startsFrom"
                                    to={{
                                      pathname: SINGLE_PRODUCT_ROUTE.replace(
                                        ":prodId",
                                        product.id
                                      ),
                                      state: {
                                        chosenProduct: product.id,
                                        isLoggedIn: isLoggedIn,
                                        email: email,
                                        token: token,
                                      },
                                    }}
                                  >
                                    Starts from ${product.startPriceText}
                                  </Link>
                                </div>
                              );
                            }.bind(this)
                          )}
                      </div>
                    </InfiniteScroll>
                  )}
                  {categoryId != 0 &&
                    (products == null || products.length <= 0) && (
                      <div className="infErrorMessage">
                        {NO_PRODUCTS_IN_CATEGORY_MESSAGE}
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
