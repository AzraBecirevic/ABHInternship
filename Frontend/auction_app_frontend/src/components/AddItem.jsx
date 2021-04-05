import React, { Component } from "react";
import Heading from "./Heading";
import CategoryService from "../services/categoryService";
import SubcategoryService from "../services/subcategoryService";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AddItem.css";
import InputGroupWithExtras from "react-bootstrap/esm/InputGroup";
import { TextField } from "@material-ui/core";
import { FormText, ThemeProvider } from "react-bootstrap";
import {
  DESCRIPTION_RULE_MESSAGE,
  MAX_ALLOWED_START_PRICE,
  PRODUCT_DATES_RULE_MESSAGE,
  PRODUCT_NAME_FORMAT_MESSAGE,
  PRODUCT_NAME_REQUIRED_MESSAGE,
  PRODUCT_NAME_RULE_MESSAGE,
  START_PRICE_FORMAT_MESSAGE,
  START_PRICE_MUST_BE_BIGGER_THAN_0_MESSAGE,
  CATEGORY_REQUIRED_MESSAGE,
  SUBCATEGORY_REQUIRED_MESSAGE,
  DESCRIPTION_REQUIRED_MESSAGE,
  DESCRIPTION_FORMAT_MESSAGE,
  START_PRICE_REQUIRED_MESSAGE,
  START_DATE_REQUIRED_MESSAGE,
  END_DATE_REQUIRED_MESSAGE,
  START_DATE_MIN_VALUE_MESSAGE,
  END_DATE_MIN_VALUE_MESSAGE,
  PRODUCT_ACTIVE_VALUE_MESSAGE,
} from "../constants/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddItemSetPrice from "./AddItemSetPrice";
import AddItemInfo from "./AddItemInfo";
import ValidationService from "../services/validationService";
import {
  BID_MAXIMUM_PRICE,
  START_PRICE_MAXIMUM_VALUE,
} from "../constants/bidPrice";

export class AddItem extends Component {
  state = {
    currentTab: "",
    productName: "",
    productNameErrMess: "",
    chosenCategoryId: 0,
    chosenCategoryIdErrMess: "",
    chosenSubcategoryId: "",
    chosenSubcategoryIdErrMess: "",
    description: "",
    descriptionErrMess: "",
    imgFiles: null,
    imgFilesErrMess: "",
    startPrice: "",
    startPriceErrMessage: "",
    startDate: "",
    startDateErrMess: "",
    endDate: "",
    endDateErrMess: "",
    country: "",
    region: "",
    city: "",
    zipCode: "",
    street: "",
    cityErrMess: "",
    zipCodeErrMess: "",
    streetErrMess: "",
    countryErrMess: "",
    regionErrMess: "",
    categoryList: null,
    subcategoryList: null,
  };

  // currentTabs = ["addItem", "setPrices", "locationShipping"];

  categoryService = new CategoryService();
  subcategoryService = new SubcategoryService();
  validationService = new ValidationService();

  componentDidMount = async () => {
    var categories = await this.categoryService.getCategories();

    this.setState({ currentTab: "addItemTab", categoryList: categories });
  };

  loadSubcategories = async (categoryId) => {
    if (categoryId !== 0) {
      var subcategories = await this.subcategoryService.getSubcategoriesByCategoryId(
        categoryId
      );

      this.setState({ subcategoryList: subcategories });
    }
  };

  onChange = (e) => {
    if (e.target.name == "chosenCategoryId") {
      this.loadSubcategories(e.target.value);
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  validateProductName = () => {
    const { productName } = this.state;
    if (this.validationService.validateRequiredFiled(productName) == false) {
      this.setState({ productNameErrMess: PRODUCT_NAME_REQUIRED_MESSAGE });
      return false;
    }
    if (
      this.validationService.validateProductNameFormat(productName) == false
    ) {
      this.setState({ productNameErrMess: PRODUCT_NAME_FORMAT_MESSAGE });
      return false;
    }
    return true;
  };

  validateChosenCategoryId = () => {
    const { chosenCategoryId } = this.state;
    if (chosenCategoryId <= 0) {
      this.setState({ chosenCategoryIdErrMess: CATEGORY_REQUIRED_MESSAGE });
      return false;
    }
    return true;
  };

  validateChosenSubcategoryId = () => {
    const { chosenSubcategoryId } = this.state;
    if (chosenSubcategoryId <= 0) {
      this.setState({
        chosenSubcategoryIdErrMess: SUBCATEGORY_REQUIRED_MESSAGE,
      });
      return false;
    }
    return true;
  };

  validateDescription = () => {
    const { description } = this.state;
    if (this.validationService.validateRequiredFiled(description) == false) {
      this.setState({ descriptionErrMess: DESCRIPTION_REQUIRED_MESSAGE });
      return false;
    }
    if (
      this.validationService.validateDescriptionFormat(description) == false
    ) {
      this.setState({ descriptionErrMess: DESCRIPTION_FORMAT_MESSAGE });
      return false;
    }
    return true;
  };

  validateAddItemTab = () => {
    this.setState({
      productNameErrMess: "",
      chosenCategoryIdErrMess: "",
      chosenSubcategoryIdErrMess: "",
      descriptionErrMess: "",
    });
    var addItemtabValid = true;
    if (this.validateProductName() == false) {
      addItemtabValid = false;
    }
    if (this.validateChosenCategoryId() == false) {
      addItemtabValid = false;
    }
    if (this.validateChosenSubcategoryId() == false) {
      addItemtabValid = false;
    }
    if (this.validateDescription() == false) {
      addItemtabValid = false;
    }
    return addItemtabValid;
  };

  validateStartPrice = () => {
    const { startPrice } = this.state;

    if (this.validationService.validateRequiredFiled(startPrice) == false) {
      this.setState({ startPriceErrMessage: START_PRICE_REQUIRED_MESSAGE });
      return false;
    }
    if (this.validationService.validateStartPriceFormat(startPrice) == false) {
      this.setState({
        startPriceErrMessage: START_PRICE_FORMAT_MESSAGE,
      });
      return false;
    }
    if (startPrice <= 0) {
      this.setState({
        startPriceErrMessage: START_PRICE_MUST_BE_BIGGER_THAN_0_MESSAGE,
      });
      return false;
    }
    if (startPrice > START_PRICE_MAXIMUM_VALUE) {
      this.setState({
        startPriceErrMessage: MAX_ALLOWED_START_PRICE,
      });
      return false;
    }
    return true;
  };

  validateStartDate = () => {
    const { startDate } = this.state;

    if (this.validationService.validateStartDate(startDate) == false) {
      this.setState({ startDateErrMess: START_DATE_REQUIRED_MESSAGE });
      return false;
    }

    return true;
  };

  validateEndDate = () => {
    const { endDate } = this.state;

    if (this.validationService.validateStartDate(endDate) == false) {
      this.setState({ endDateErrMess: END_DATE_REQUIRED_MESSAGE });
      return false;
    }

    return true;
  };
  validateStartEndDatesValues = () => {
    const { endDate, startDate } = this.state;

    if (
      new Date().toLocaleDateString() > new Date(startDate).toLocaleDateString()
    ) {
      this.setState({ startDateErrMess: START_DATE_MIN_VALUE_MESSAGE });
      return false;
    }

    if (
      startDate !== "" &&
      endDate !== "" &&
      (new Date(startDate).toJSON().slice(0, 10) >
        new Date(endDate).toJSON().slice(0, 10) ||
        new Date(startDate).toJSON().slice(0, 10) ==
          new Date(endDate).toJSON().slice(0, 10))
    ) {
      this.setState({
        endDateErrMess: END_DATE_MIN_VALUE_MESSAGE,
      });
      return false;
    }

    var currentYear = new Date().getFullYear();
    var date = new Date(startDate);
    date.setFullYear(currentYear + 1);

    if (
      endDate != "" &&
      new Date(endDate).toJSON().slice(0, 10) >
        new Date(date).toJSON().slice(0, 10)
    ) {
      this.setState({
        endDateErrMess: PRODUCT_ACTIVE_VALUE_MESSAGE,
      });
      return false;
    }

    return true;
  };

  validateSetPricesTab = () => {
    this.setState({
      startPriceErrMessage: "",
      startDateErrMess: "",
      endDateErrMess: "",
    });
    var setPricesTabValid = true;
    if (this.validateStartPrice() == false) {
      setPricesTabValid = false;
    }
    if (this.validateStartDate() == false) {
      setPricesTabValid = false;
    }
    if (this.validateEndDate() == false) {
      setPricesTabValid = false;
    }
    if (this.validateStartEndDatesValues() == false) {
      setPricesTabValid = false;
    }

    return setPricesTabValid;
  };

  done = () => {
    if (this.validateSetPricesTab()) {
      console.log("validno");
    }
  };

  goBack = () => {
    const { currentTab } = this.state;

    if (currentTab == "setPricesTab") {
      this.setState({ currentTab: "addItemTab" });
    }
  };

  goToNext = () => {
    const { currentTab } = this.state;

    if (currentTab == "addItemTab") {
      if (this.validateAddItemTab()) {
        this.setState({ currentTab: "setPricesTab" });
      }
    }
  };

  render() {
    const {
      currentTab,
      productName,
      productNameErrMess,
      chosenCategoryId,
      chosenCategoryIdErrMess,
      categoryList,
      chosenSubcategoryId,
      chosenSubcategoryIdErrMess,
      subcategoryList,
      description,
      descriptionErrMess,
      startPrice,
      startPriceErrMessage,
      startDate,
      startDateErrMess,
      endDate,
      endDateErrMess,
    } = this.state;
    return (
      <div>
        <Heading secondTitle="MY ACCOUNT / BECOME SELLER"></Heading>
        <div className="row addItemDiv">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-lg-12">
                <div className="row tabsRow">
                  <div className="col-lg-2"></div>
                  <div className="col-lg-8">
                    {currentTab == "addItemTab" && (
                      <AddItemInfo
                        productName={productName}
                        productNameErrMess={productNameErrMess}
                        categoryList={categoryList}
                        chosenCategoryId={chosenCategoryId}
                        chosenCategoryIdErrMess={chosenCategoryIdErrMess}
                        subcategoryList={subcategoryList}
                        chosenSubcategoryId={chosenSubcategoryId}
                        chosenSubcategoryIdErrMess={chosenSubcategoryIdErrMess}
                        description={description}
                        descriptionErrMess={descriptionErrMess}
                        onChange={this.onChange}
                        goToNext={this.goToNext}
                      ></AddItemInfo>
                    )}
                    {currentTab == "setPricesTab" && (
                      <AddItemSetPrice
                        startPrice={startPrice}
                        startPriceErrMessage={startPriceErrMessage}
                        startDate={startDate}
                        startDateErrMess={startDateErrMess}
                        endDate={endDate}
                        endDateErrMess={endDateErrMess}
                        onChange={this.onChange}
                        goBack={this.goBack}
                        done={this.done}
                      ></AddItemSetPrice>
                    )}
                  </div>
                  <div className="col-lg-2"></div>
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

export default AddItem;
