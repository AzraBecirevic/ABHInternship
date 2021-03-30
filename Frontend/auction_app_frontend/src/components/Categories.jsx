import React, { Component } from "react";
import CategoryService from "../services/categoryService";
import Heading from "./Heading";
import styles from "./Categories.css";
import { Link, Redirect } from "react-router-dom";
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
  GRID_VIEW,
  LIST_VIEW,
} from "../constants/messages";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGavel } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faTh } from "@fortawesome/free-solid-svg-icons";
import { faThList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubcategoryService from "../services/subcategoryService";
import FilteredProducts from "../model/FilteredProducts";
import {
  CATEGORY_TYPE,
  SEARCH_PRODUCT_TYPE,
  SUBCATEGORY_TYPE,
} from "../constants/types";
import { Grid, Slider, Typography } from "@material-ui/core";
import { ThemeProvider } from "react-bootstrap";
import { EMAIL, TOKEN } from "../constants/auth";
import Chart from "./Chart";
import LoadingSpinner from "./LoadingSpinner";
import Loader from "react-loader-spinner";

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
    lowerPrice: 0,
    higherPrice: 0,
    textLowerPrice: "",
    textHigherPrice: "",
    sortingType: null,
    sortingTypesHidden: true,
    sliderCurrentlyChanging: false,
    gridChosen: true,
  };

  categoryService = new CategoryService();
  productService = new ProductService();
  toastService = new ToastService();
  subcategoryService = new SubcategoryService();
  fetchNumber = 0;

  lowerPriceText = "";
  higherPriceText = "";
  lowerPriceValue = 0;
  higherPriceValue = 0;

  sortingTypes = [
    { id: 1, sortType: "DEFAULT_SORTING", sortName: "Default sorting" },
    { id: 2, sortType: "ADDED", sortName: "Sort by Newness" },
    { id: 3, sortType: "TIME_LEFT", sortName: "Sort by Time Left" },
    {
      id: 4,
      sortType: "PRICE_LOW_TO_HIGH",
      sortName: "Price - low to high",
    },
    {
      id: 5,
      sortType: "PRICE_HIGH_TO_LOW",
      sortName: "Price - high to low",
    },
  ];

  viewOptions = ["Grid", "List"];

  filteredProducts = new FilteredProducts();

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.match.params.categories != this.props.match.params.categories ||
      prevProps.match.params.subcategories !=
        this.props.match.params.subcategories ||
      prevProps.match.params.priceFilter !=
        this.props.match.params.priceFilter ||
      prevProps.match.params.productName !=
        this.props.match.params.productName ||
      prevProps.match.params.sortType != this.props.match.params.sortType ||
      prevProps.match.params.view != this.props.match.params.view
    ) {
      this.componentDidMount();
    } else if (this.props.location.state != null) {
      if (prevProps.location.state.chosenCategory) {
        prevProps.location.state.chosenCategory = 0;
      }
      if (this.props.location.state.chosenCategory) {
        this.props.location.state.chosenCategory = 0;
      }
      if (
        prevProps.location.state.chosenCategory !==
          this.props.location.state.chosenCategory ||
        prevProps.location.state.productName !==
          this.props.location.state.productName
      ) {
        this.componentDidMount();
      }
    }
  };

  componentDidMount = async () => {
    this.fetchNumber = 1;
    try {
      var chosenCategory = 0;
      var isLoggedIn = false;
      var email = "";
      var token = "";
      var productName = "";
      var chosenType = null;
      var chosenOptionGrid = true;

      this.setIsLoading(true);

      var productsDto = null;

      if (this.props.location == null || this.props.location.state == null) {
        if (localStorage.getItem(TOKEN) != null) {
          isLoggedIn = true;
          email = localStorage.getItem(EMAIL);
          token = localStorage.getItem(TOKEN);
        } else if (sessionStorage.getItem(TOKEN) != null) {
          isLoggedIn = true;
          email = sessionStorage.getItem(EMAIL);
          token = sessionStorage.getItem(TOKEN);
          chosenCategory = 0;
        }
      } else {
        chosenCategory =
          this.props.location.state.categoryId == undefined
            ? 0
            : this.props.location.state.categoryId;
        isLoggedIn = this.props.location.state.isLoggedIn;
        email = this.props.location.state.email;
        token = this.props.location.state.token;
        productName = this.props.location.state.productName;
      }

      this.state.categoryId = chosenCategory;
      this.state.isLoggedIn = isLoggedIn;
      this.state.email = email;
      this.state.token = token;
      this.state.productName = productName;

      this.filteredProducts = new FilteredProducts();

      await this.setState({ filterTags: [] });

      var categoryFiltersPath = this.props.match.params.categories;
      if (
        categoryFiltersPath !== undefined &&
        categoryFiltersPath !== null &&
        categoryFiltersPath !== ""
      ) {
        if (categoryFiltersPath !== ":categories") {
          var categoryFilters = categoryFiltersPath.split(",");
          for (let i = 0; i < categoryFilters.length; i++) {
            var categoryLabel = categoryFilters[i].split("-");

            this.filteredProducts.categoryIds.push(categoryLabel[0]);
            this.setState({
              filterTags: [
                ...this.state.filterTags,
                {
                  id: categoryLabel[0],
                  name: categoryLabel[1],
                  type: CATEGORY_TYPE,
                },
              ],
            });
          }
        }
      }

      var subcategoryFiltersPath = this.props.match.params.subcategories;
      if (
        subcategoryFiltersPath !== undefined &&
        subcategoryFiltersPath !== null &&
        subcategoryFiltersPath !== ""
      ) {
        if (subcategoryFiltersPath !== ":subcategories") {
          var subcategoryFilters = subcategoryFiltersPath.split(",");
          for (let i = 0; i < subcategoryFilters.length; i++) {
            var subcategoryLabel = subcategoryFilters[i].split("-");

            this.filteredProducts.subcategoryIds.push(subcategoryLabel[0]);
            this.setState({
              filterTags: [
                ...this.state.filterTags,
                {
                  id: subcategoryLabel[0],
                  name: subcategoryLabel[1],
                  type: SUBCATEGORY_TYPE,
                },
              ],
            });
          }
        }
      }
      const priceFilterData = await this.productService.getPriceFilterData();

      var productNameFilterPath = this.props.match.params.productName;
      var priceFilterPath = this.props.match.params.priceFilter;
      if (
        priceFilterPath !== undefined &&
        priceFilterPath !== null &&
        priceFilterPath !== ""
      ) {
        if (priceFilterPath !== ":priceFilter") {
          var priceFilter = priceFilterPath.split(",");
          this.lowerPriceValue = priceFilter[0];
          this.higherPriceValue = priceFilter[1];
          this.filteredProducts.minPrice = this.lowerPriceValue;
          this.filteredProducts.maxPrice = this.higherPriceValue;
          this.lowerPriceText = this.lowerPriceValue;
          this.higherPriceText = this.higherPriceValue;
          if (
            this.lowerPriceText.length <= 0 ||
            this.higherPriceText.length <= 0
          ) {
            this.lowerPriceText = this.lowerPriceValue;
            this.higherPriceText = this.higherPriceValue;
          }
        }
      } else {
        this.lowerPriceValue = priceFilterData.minPrice;
        this.higherPriceValue = priceFilterData.maxPrice;
        if (
          this.lowerPriceText.length <= 0 ||
          this.higherPriceText.length <= 0
        ) {
          this.lowerPriceText = priceFilterData.minPriceText;
          this.higherPriceText = priceFilterData.maxPriceText;
        }
        if (
          priceFilterPath == undefined &&
          subcategoryFiltersPath == undefined &&
          categoryFiltersPath == undefined
        ) {
          this.lowerPriceValue = priceFilterData.minPrice;
          this.higherPriceValue = priceFilterData.maxPrice;
          this.lowerPriceText = priceFilterData.minPriceText;
          this.higherPriceText = priceFilterData.maxPriceText;
        }
      }

      if (
        productNameFilterPath !== undefined &&
        productNameFilterPath !== null &&
        productNameFilterPath !== ""
      ) {
        if (productNameFilterPath !== ":productName") {
          this.filteredProducts.productName = productNameFilterPath;
        }
      }

      var sortFilterPath = this.props.match.params.sortType;
      if (
        sortFilterPath !== undefined &&
        sortFilterPath !== null &&
        sortFilterPath !== "" &&
        sortFilterPath !== ":sortType" &&
        parseInt(sortFilterPath) >= 1 &&
        parseInt(sortFilterPath) <= 5
      ) {
        chosenType = this.sortingTypes.filter(function (sortingType) {
          return sortingType.id == sortFilterPath;
        })[0];
        this.filteredProducts.sortType = chosenType.sortType;
      } else {
        chosenType = this.sortingTypes[0];
      }

      var viewOptionPath = this.props.match.params.view;
      if (
        viewOptionPath !== undefined &&
        viewOptionPath !== null &&
        viewOptionPath !== ""
      ) {
        if (viewOptionPath == this.viewOptions[1]) {
          chosenOptionGrid = false;
        } else {
          chosenOptionGrid = true;
        }
      }

      productsDto = await this.productService.getFilteredProducts(
        this.filteredProducts,
        this.fetchNumber
      );

      const categoriesList = await this.categoryService.getCategories();

      this.setState({
        products: productsDto == null ? null : productsDto.productsList,
        hasMoreData: productsDto == null ? false : productsDto.hasMoreData,
        categories: categoriesList,
        min: priceFilterData.minPrice,
        max: priceFilterData.maxPrice,
        minText: priceFilterData.minPriceText,
        maxText: priceFilterData.maxPriceText,
        averagePriceText: priceFilterData.averagePriceText,
        sortingType: chosenType,
        sliderCurrentlyChanging: false,
        gridChosen: chosenOptionGrid,
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

    var filterTagsToRemove = [];
    var removed = false;

    for (let i = 0; i < subcategoryList.length; i++) {
      for (let k = 0; k < this.state.filterTags.length; k++) {
        if (
          subcategoryList[i].id == this.state.filterTags[k].id &&
          this.state.filterTags[k].type == SUBCATEGORY_TYPE
        ) {
          filterTagsToRemove.push(this.state.filterTags[k]);
        }
      }
    }

    for (let i = 0; i < filterTagsToRemove.length; i++) {
      await this.setState({
        filterTags: this.state.filterTags.filter(function (fTag) {
          return fTag != filterTagsToRemove[i];
        }),
      });
      removed = true;
    }

    var categoryLink = this.props.match.params.categories;

    categoryLink == undefined
      ? (categoryLink = categoryId + "-" + categoryName)
      : (categoryLink += "," + categoryId + "-" + categoryName);

    var subcategoryLink = "";
    for (let i = 0; i < this.state.filterTags.length; i++) {
      if (this.state.filterTags[i].type == SUBCATEGORY_TYPE) {
        subcategoryLink +=
          this.state.filterTags[i].id +
          "-" +
          this.state.filterTags[i].name +
          ",";
      }
    }
    subcategoryLink = subcategoryLink.substring(0, subcategoryLink.length - 1);

    var route = CATEGORIES_ROUTE + `/Categories/${categoryLink}`;

    if (subcategoryLink == "") {
      subcategoryLink = ":subcategories";

      if (this.props.match.params.priceFilter !== undefined) {
        route += `/PriceFilter/${this.props.match.params.priceFilter}`;
      }
      if (this.props.match.params.productName !== undefined) {
        route += `/ProductName/${this.props.match.params.productName}`;
      }
      if (this.props.match.params.sortType !== undefined) {
        route += `/Sort/${this.props.match.params.sortType}`;
      }
      if (this.props.match.params.view !== undefined) {
        route += `/View/${this.props.match.params.view}`;
      }
      this.props.history.push({
        pathname: route,
      });
    } else if (!removed) {
      route = route + `/Subcategories/${this.props.match.params.subcategories}`;

      if (this.props.match.params.priceFilter !== undefined) {
        route += `/PriceFilter/${this.props.match.params.priceFilter}`;
      }
      if (this.props.match.params.productName !== undefined) {
        route += `/ProductName/${this.props.match.params.productName}`;
      }
      if (this.props.match.params.sortType !== undefined) {
        route += `/Sort/${this.props.match.params.sortType}`;
      }
      if (this.props.match.params.view !== undefined) {
        route += `/View/${this.props.match.params.view}`;
      }
      this.props.history.push({
        pathname: route,
      });
    } else {
      route = route + `/Subcategories/${subcategoryLink}`;
      if (this.props.match.params.priceFilter !== undefined) {
        route += `/PriceFilter/${this.props.match.params.priceFilter}`;
      }
      if (this.props.match.params.productName !== undefined) {
        route += `/ProductName/${this.props.match.params.productName}`;
      }
      if (this.props.match.params.sortType !== undefined) {
        route += `/Sort/${this.props.match.params.sortType}`;
      }
      if (this.props.match.params.view !== undefined) {
        route += `/View/${this.props.match.params.view}`;
      }
      this.props.history.push({
        pathname: route,
      });
    }
  };

  checkIfSubcategoryIsAlreadyFiltered = (subcategoryId) => {
    for (let i = 0; i < this.filteredProducts.subcategoryIds.length; i++) {
      if (this.filteredProducts.subcategoryIds[i] == subcategoryId) {
        return true;
      }
    }
  };

  subcategoryChosen = async (subcategoryId, categoryId, subcategoryName) => {
    if (this.checkIfSubcategoryIsAlreadyFiltered(subcategoryId)) {
      return;
    }

    var subcategoryLink = this.props.match.params.subcategories;

    subcategoryLink == undefined
      ? (subcategoryLink = subcategoryId + "-" + subcategoryName)
      : (subcategoryLink += "," + subcategoryId + "-" + subcategoryName);

    var removed = false;
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
      await this.setState({
        filterTags: this.state.filterTags.filter(function (fTag) {
          return fTag != filterTag;
        }),
      });
      removed = true;
    }

    var categoryLink = "";

    for (let i = 0; i < this.state.filterTags.length; i++) {
      if (this.state.filterTags[i].type == CATEGORY_TYPE) {
        categoryLink +=
          this.state.filterTags[i].id +
          "-" +
          this.state.filterTags[i].name +
          ",";
      }
    }
    categoryLink = categoryLink.substring(0, categoryLink.length - 1);

    var route = CATEGORIES_ROUTE;

    if (categoryLink == "") {
      categoryLink = ":categories";

      route += `/Subcategories/${subcategoryLink}`;

      if (this.props.match.params.priceFilter !== undefined) {
        route += `/PriceFilter/${this.props.match.params.priceFilter}`;
      }
      if (this.props.match.params.productName !== undefined) {
        route += `/ProductName/${this.props.match.params.productName}`;
      }
      if (this.props.match.params.sortType !== undefined) {
        route += `/Sort/${this.props.match.params.sortType}`;
      }
      if (this.props.match.params.view !== undefined) {
        route += `/View/${this.props.match.params.view}`;
      }
      this.props.history.push({
        pathname: route,
      });
    } else if (!removed) {
      route += `/Categories/${this.props.match.params.categories}`;
      route += `/Subcategories/${subcategoryLink}`;
      if (this.props.match.params.priceFilter !== undefined) {
        route += `/PriceFilter/${this.props.match.params.priceFilter}`;
      }
      if (this.props.match.params.productName !== undefined) {
        route += `/ProductName/${this.props.match.params.productName}`;
      }
      if (this.props.match.params.sortType !== undefined) {
        route += `/Sort/${this.props.match.params.sortType}`;
      }
      if (this.props.match.params.view !== undefined) {
        route += `/View/${this.props.match.params.view}`;
      }
      this.props.history.push({
        pathname: route,
      });
    } else {
      route += `/Categories/${categoryLink}`;
      route += `/Subcategories/${subcategoryLink}`;
      if (this.props.match.params.priceFilter !== undefined) {
        route += `/PriceFilter/${this.props.match.params.priceFilter}`;
      }
      if (this.props.match.params.productName !== undefined) {
        route += `/ProductName/${this.props.match.params.productName}`;
      }
      if (this.props.match.params.sortType !== undefined) {
        route += `/Sort/${this.props.match.params.sortType}`;
      }
      if (this.props.match.params.view !== undefined) {
        route += `/View/${this.props.match.params.view}`;
      }
      this.props.history.push({
        pathname: route,
      });
    }
  };

  removeFilter = async (filterTag) => {
    var filterTagsArray = this.state.filterTags;

    filterTagsArray = filterTagsArray.filter(function (fTag) {
      return fTag != filterTag;
    });

    if (filterTag.type == CATEGORY_TYPE) {
      var categoryLink = "";
      for (let i = 0; i < filterTagsArray.length; i++) {
        if (filterTagsArray[i].type == CATEGORY_TYPE) {
          categoryLink +=
            filterTagsArray[i].id + "-" + filterTagsArray[i].name + ",";
        }
      }
      categoryLink = categoryLink.substring(0, categoryLink.length - 1);

      var route = CATEGORIES_ROUTE;

      if (categoryLink == "") {
        categoryLink = ":categories";

        if (this.props.match.params.subcategories !== undefined) {
          route =
            route + `/Subcategories/${this.props.match.params.subcategories}`;
        }
        if (this.props.match.params.priceFilter !== undefined) {
          route += `/PriceFilter/${this.props.match.params.priceFilter}`;
        }
        if (this.props.match.params.productName !== undefined) {
          route += `/ProductName/${this.props.match.params.productName}`;
        }
        if (this.props.match.params.sortType !== undefined) {
          route += `/Sort/${this.props.match.params.sortType}`;
        }
        if (this.props.match.params.view !== undefined) {
          route += `/View/${this.props.match.params.view}`;
        }
        this.props.history.push({
          pathname: route,
        });
      } else {
        route += `/Categories/${categoryLink}`;
        if (this.props.match.params.subcategories !== undefined) {
          route =
            route + `/Subcategories/${this.props.match.params.subcategories}`;
        }
        if (this.props.match.params.priceFilter !== undefined) {
          route += `/PriceFilter/${this.props.match.params.priceFilter}`;
        }
        if (this.props.match.params.productName !== undefined) {
          route += `/ProductName/${this.props.match.params.productName}`;
        }
        if (this.props.match.params.sortType !== undefined) {
          route += `/Sort/${this.props.match.params.sortType}`;
        }
        if (this.props.match.params.view !== undefined) {
          route += `/View/${this.props.match.params.view}`;
        }
        this.props.history.push({
          pathname: route,
        });
      }
    } else if (filterTag.type == SUBCATEGORY_TYPE) {
      var subcategoryLink = "";
      for (let i = 0; i < filterTagsArray.length; i++) {
        if (filterTagsArray[i].type == SUBCATEGORY_TYPE) {
          subcategoryLink +=
            filterTagsArray[i].id + "-" + filterTagsArray[i].name + ",";
        }
      }
      subcategoryLink = subcategoryLink.substring(
        0,
        subcategoryLink.length - 1
      );

      var route = CATEGORIES_ROUTE;

      if (subcategoryLink == "") {
        subcategoryLink = ":subcategories";

        if (this.props.match.params.categories !== undefined) {
          route += `/Categories/${this.props.match.params.categories}`;
        }
        if (this.props.match.params.priceFilter !== undefined) {
          route += `/PriceFilter/${this.props.match.params.priceFilter}`;
        }
        if (this.props.match.params.productName !== undefined) {
          route += `/ProductName/${this.props.match.params.productName}`;
        }
        if (this.props.match.params.sortType !== undefined) {
          route += `/Sort/${this.props.match.params.sortType}`;
        }
        if (this.props.match.params.view !== undefined) {
          route += `/View/${this.props.match.params.view}`;
        }
        this.props.history.push({
          pathname: route,
        });
      } else {
        if (this.props.match.params.categories !== undefined) {
          route += `/Categories/${this.props.match.params.categories}`;
        }
        route += `/Subcategories/${subcategoryLink}`;

        if (this.props.match.params.priceFilter !== undefined) {
          route += `/PriceFilter/${this.props.match.params.priceFilter}`;
        }
        if (this.props.match.params.productName !== undefined) {
          route += `/ProductName/${this.props.match.params.productName}`;
        }
        if (this.props.match.params.sortType !== undefined) {
          route += `/Sort/${this.props.match.params.sortType}`;
        }
        if (this.props.match.params.view !== undefined) {
          route += `/View/${this.props.match.params.view}`;
        }
        this.props.history.push({
          pathname: route,
        });
      }
    }
  };

  changePriceFilter = async (value) => {
    this.setState({ sliderCurrentlyChanging: true });
    this.filteredProducts.minPrice = value[0];
    this.filteredProducts.maxPrice = value[1];

    var priceFilterLink =
      this.filteredProducts.minPrice + "," + this.filteredProducts.maxPrice;

    this.lowerPriceText = value[0];
    this.higherPriceText = value[1];

    this.lowerPriceValue = value[0];
    this.higherPriceValue = value[1];

    var route = CATEGORIES_ROUTE;

    if (this.props.match.params.categories !== undefined) {
      route += `/Categories/${this.props.match.params.categories}`;
    }
    if (this.props.match.params.subcategories !== undefined) {
      route = route + `/Subcategories/${this.props.match.params.subcategories}`;
    }

    route += `/PriceFilter/${priceFilterLink}`;

    if (this.props.match.params.productName !== undefined) {
      route += `/ProductName/${this.props.match.params.productName}`;
    }
    if (this.props.match.params.sortType !== undefined) {
      route += `/Sort/${this.props.match.params.sortType}`;
    }
    if (this.props.match.params.view !== undefined) {
      route += `/View/${this.props.match.params.view}`;
    }
    this.props.history.push({
      pathname: route,
    });
  };

  showSortingTypes = () => {
    this.setState({ sortingTypesHidden: false });
  };
  closeSortingTypes = () => {
    this.setState({ sortingTypesHidden: true });
  };

  sortingTypeChosen = (sortingTypeId) => {
    var route = CATEGORIES_ROUTE;

    if (this.props.match.params.categories !== undefined) {
      route += `/Categories/${this.props.match.params.categories}`;
    }
    if (this.props.match.params.subcategories !== undefined) {
      route = route + `/Subcategories/${this.props.match.params.subcategories}`;
    }
    if (this.props.match.params.priceFilter !== undefined) {
      route += `/PriceFilter/${this.props.match.params.priceFilter}`;
    }
    if (this.props.match.params.productName !== undefined) {
      route += `/ProductName/${this.props.match.params.productName}`;
    }

    route += `/Sort/${sortingTypeId}`;

    if (this.props.match.params.view !== undefined) {
      route += `/View/${this.props.match.params.view}`;
    }

    this.closeSortingTypes();

    this.props.history.push({
      pathname: route,
    });
  };

  chooseGridView = () => {
    var route = CATEGORIES_ROUTE;

    if (this.props.match.params.categories !== undefined) {
      route += `/Categories/${this.props.match.params.categories}`;
    }
    if (this.props.match.params.subcategories !== undefined) {
      route = route + `/Subcategories/${this.props.match.params.subcategories}`;
    }
    if (this.props.match.params.priceFilter !== undefined) {
      route += `/PriceFilter/${this.props.match.params.priceFilter}`;
    }
    if (this.props.match.params.productName !== undefined) {
      route += `/ProductName/${this.props.match.params.productName}`;
    }
    if (this.props.match.params.sortType !== undefined) {
      route += `/Sort/${this.props.match.params.sortType}`;
    }
    route += `/View/${this.viewOptions[0]}`;

    this.props.history.push({
      pathname: route,
    });
  };

  chooseListView = () => {
    var route = CATEGORIES_ROUTE;

    if (this.props.match.params.categories !== undefined) {
      route += `/Categories/${this.props.match.params.categories}`;
    }
    if (this.props.match.params.subcategories !== undefined) {
      route = route + `/Subcategories/${this.props.match.params.subcategories}`;
    }
    if (this.props.match.params.priceFilter !== undefined) {
      route += `/PriceFilter/${this.props.match.params.priceFilter}`;
    }
    if (this.props.match.params.productName !== undefined) {
      route += `/ProductName/${this.props.match.params.productName}`;
    }
    if (this.props.match.params.sortType !== undefined) {
      route += `/Sort/${this.props.match.params.sortType}`;
    }
    route += `/View/${this.viewOptions[1]}`;

    this.props.history.push({
      pathname: route,
    });
  };

  render() {
    const {
      categories,
      clickedCategory,
      subcategories,
      min,
      max,
      averagePriceText,
      filterTags,
      categoryId,
      products,
      hasMoreData,
      currentFetching,
      isLoggedIn,
      email,
      token,
      sortingType,
      sortingTypesHidden,
      sliderCurrentlyChanging,
      gridChosen,
    } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 categoriesColumn">
            <div className="categoriesDiv">
              <div className="row categoriesRow">
                <div className="col-lg-12 col-md-12 col-sm-12 categories">
                  <div className="row filterTagDiv">
                    {filterTags != null &&
                      filterTags.length > 0 &&
                      filterTags.map(
                        function (filterTag, index) {
                          return (
                            <div className="filterTagBox" key={index}>
                              <div className="filterTagBoxInnerDiv">
                                <div className="filterTagName">
                                  {filterTag.name}
                                </div>
                                <FontAwesomeIcon
                                  onClick={() => {
                                    this.removeFilter(filterTag);
                                  }}
                                  style={{ color: "#ffffff" }}
                                  icon={faTimes}
                                  size={"lg"}
                                ></FontAwesomeIcon>
                              </div>
                            </div>
                          );
                        }.bind(this)
                      )}
                  </div>
                </div>
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
                    <div className="priceSliderDiv">
                      <div style={{ textAlign: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          {sliderCurrentlyChanging == true && (
                            <Loader
                              className="loader"
                              type="Oval"
                              color="#8367d8"
                              height="50px"
                              width="50px"
                            />
                          )}
                          {sliderCurrentlyChanging == false && (
                            <Chart productsProp={products}></Chart>
                          )}
                        </div>

                        <Slider
                          key={`slider-${this.lowerPriceValue}`}
                          min={min}
                          max={max}
                          valueLabelDisplay="auto"
                          aria-labelledby="range-slider"
                          defaultValue={[
                            this.lowerPriceValue,
                            this.higherPriceValue,
                          ]}
                          onChange={(e, val) => {
                            this.changePriceFilter(val);
                          }}
                        />
                      </div>
                    </div>
                    <div className="priceFilterDetails">
                      <div>
                        ${this.lowerPriceText}-${this.higherPriceText}
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
                    <div className="row productOptionsDiv">
                      <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="chosenSortTypeDiv">
                          <div>{sortingType.sortName}</div>
                          <div>
                            {sortingTypesHidden && (
                              <FontAwesomeIcon
                                className="closeOpenSortDivIcon"
                                onClick={() => {
                                  this.showSortingTypes();
                                }}
                                style={{ color: "#252525" }}
                                icon={faChevronDown}
                                size={"lg"}
                              ></FontAwesomeIcon>
                            )}
                            {!sortingTypesHidden && (
                              <FontAwesomeIcon
                                className="closeOpenSortDivIcon"
                                onClick={() => {
                                  this.closeSortingTypes();
                                }}
                                style={{ color: "#252525" }}
                                icon={faChevronUp}
                                size={"lg"}
                              ></FontAwesomeIcon>
                            )}
                          </div>
                        </div>
                        <div
                          hidden={sortingTypesHidden}
                          className="sortingTypesDiv"
                        >
                          <div className="sortingTypesList">
                            {this.sortingTypes.map(
                              function (sortingType, index) {
                                return (
                                  <div
                                    key={index}
                                    className="sortingTypesItem"
                                    onClick={() =>
                                      this.sortingTypeChosen(sortingType.id)
                                    }
                                  >
                                    {sortingType.sortName}
                                  </div>
                                );
                              }.bind(this)
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8 col-md-6 col-sm-6 gridList">
                        <div className="gridListOptionsDiv">
                          <div
                            className={
                              gridChosen
                                ? "gridListOptionActive"
                                : "gridListOption"
                            }
                            onClick={this.chooseGridView}
                          >
                            {" "}
                            <FontAwesomeIcon
                              icon={faTh}
                              size={"lg"}
                            ></FontAwesomeIcon>{" "}
                            {GRID_VIEW}
                          </div>
                          <div
                            className={
                              gridChosen
                                ? "gridListOption"
                                : "gridListOptionActive"
                            }
                            onClick={this.chooseListView}
                          >
                            {" "}
                            <FontAwesomeIcon
                              icon={faThList}
                              size={"lg"}
                            ></FontAwesomeIcon>{" "}
                            {LIST_VIEW}
                          </div>
                        </div>
                      </div>
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
                          gridChosen &&
                          products.map(
                            function (product, index) {
                              return (
                                <div
                                  className="col-lg-4 col-md-6 col-sm-6 product"
                                  key={index}
                                >
                                  <div className="productImageContainer">
                                    <img
                                      className="categoryProductImage"
                                      src={`data:image/png;base64, ${product.image}`}
                                    />
                                    <div className="bidProductHoverDiv">
                                      <div className="bidBtnDiv">
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
                                          <button className="bidBtn">
                                            Bid
                                            <FontAwesomeIcon
                                              className="gavelIcon"
                                              style={{ color: "#252525" }}
                                              icon={faGavel}
                                              size={"sm"}
                                            ></FontAwesomeIcon>
                                          </button>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>

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

                        {products != null &&
                          !gridChosen &&
                          products.map(
                            function (product, index) {
                              return (
                                <div
                                  className="col-lg-12 col-md-12 col-sm-12 product"
                                  key={index}
                                >
                                  <div className="row productlListRow">
                                    <div className="col-lg-4 col-md-4 col-sm-6 product">
                                      <div className="productImageContainer">
                                        <img
                                          className="categoryProductImage"
                                          src={`data:image/png;base64, ${product.image}`}
                                        />
                                        <div className="bidProductHoverDiv">
                                          <div className="bidBtnDiv">
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
                                              <button className="bidBtn">
                                                Bid
                                                <FontAwesomeIcon
                                                  className="gavelIcon"
                                                  style={{ color: "#252525" }}
                                                  icon={faGavel}
                                                  size={"sm"}
                                                ></FontAwesomeIcon>
                                              </button>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-8 col-md-8 col-sm-6 product">
                                      {" "}
                                      <div className="productNameListViewDiv">
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
                                      <div className="productDescriptionDiv">
                                        {product.description}
                                      </div>
                                      <div className="startsFromListViewDiv">
                                        {" "}
                                        <Link
                                          className="startsFromListView"
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
                                      <div>
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
                                          <button className="bidBtnListView">
                                            Bid
                                            <FontAwesomeIcon
                                              className="gavelIcon"
                                              style={{ color: "#ECECEC" }}
                                              icon={faGavel}
                                              size={"sm"}
                                            ></FontAwesomeIcon>
                                          </button>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
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
