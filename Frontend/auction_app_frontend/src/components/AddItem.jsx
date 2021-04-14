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
  MIN_PHOTOS_NUMBER_MESSAGE,
  MIN_PHOTOS_NUMER_ERR_MESSAGE,
  MAX_PHOTOS_NUMBER_MESSAGE,
  START_DATE_MAX_VALUE_MESSAGE,
  PRODUCT_DATA_SAVED_SUCCESSFULLY,
  CHARACTERS_LEFT_MESSAGE,
  CONNECTION_REFUSED_MESSAGE,
  PRODUCT_NAME_MIN_WORDS_MESSAGE,
  DESCRIPTION_MAX_WORDS_MESSAGE,
  PRODUCT_NAME_MAX_WORDS_MESSAGE,
} from "../constants/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddItemSetPrice from "./AddItemSetPrice";
import AddItemInfo from "./AddItemInfo";
import ValidationService from "../services/validationService";

import {
  BID_MAXIMUM_PRICE,
  START_PRICE_MAXIMUM_VALUE,
} from "../constants/bidPrice";
import ProductService from "../services/productService";
import ToastService from "../services/toastService";
import {
  DESCRIPTION_MAX_CHARACTERS,
  MAX_PHOTOS,
  MIN_PHOTOS,
  PRODUCT_NAME_MAX_CHARACTERS,
} from "../constants/product";
import { EMAIL, TOKEN } from "../constants/auth";
import {
  HOME_ROUTE,
  NOT_FOUND_ROUTE,
  SINGLE_PRODUCT_ROUTE,
} from "../constants/routes";

export class AddItem extends Component {
  state = {
    email: "",
    token: "",
    isLoggedIn: false,
    currentTab: "",
    productName: "",
    productNameErrMess: "",
    chosenCategoryId: 0,
    chosenCategoryIdErrMess: "",
    chosenSubcategoryId: "",
    chosenSubcategoryIdErrMess: "",
    description: "",
    descriptionErrMess: "",
    imgFiles: [],
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
    productNameRule: "",
    descriptionRule: "",
    doneBtnDisabled: false,
  };

  categoryService = new CategoryService();
  subcategoryService = new SubcategoryService();
  validationService = new ValidationService();
  productService = new ProductService();
  toastService = new ToastService();

  componentDidMount = async () => {
    var categories = await this.categoryService.getCategories();

    var email = "";
    var token = "";
    var isLoggedIn = false;

    if (this.props.location == null || this.props.location.state == null) {
      if (localStorage.getItem(TOKEN) != null) {
        isLoggedIn = true;
        email = localStorage.getItem(EMAIL);
        token = localStorage.getItem(TOKEN);
      } else if (sessionStorage.getItem(TOKEN) != null) {
        isLoggedIn = true;
        email = sessionStorage.getItem(EMAIL);
        token = sessionStorage.getItem(TOKEN);
      }
    } else {
      isLoggedIn = true;
      email = this.props.location.state.email;
      token = this.props.location.state.token;
    }

    if (email == "" || token == "") {
      this.props.history.push(NOT_FOUND_ROUTE);
    }

    this.setState({
      currentTab: "addItemTab",
      categoryList: categories,
      email: email,
      token: token,
      isLoggedIn: isLoggedIn,
      productNameRule: PRODUCT_NAME_RULE_MESSAGE,
      descriptionRule: DESCRIPTION_RULE_MESSAGE,
    });
  };

  loadSubcategories = async (categoryId) => {
    if (categoryId !== 0) {
      var subcategories = await this.subcategoryService.getSubcategoriesByCategoryId(
        categoryId
      );

      this.setState({ subcategoryList: subcategories });
    }
  };

  addChosenImage = (img) => {
    const { imgFiles } = this.state;
    if (imgFiles.length >= MAX_PHOTOS) {
      this.setState({ imgFilesErrMess: MAX_PHOTOS_NUMBER_MESSAGE });
      return;
    }

    this.setState({
      imgFiles: [
        ...this.state.imgFiles,
        { imgFile: img, imgPreview: URL.createObjectURL(img) },
      ],
    });
  };

  removeImage = (img) => {
    this.setState({
      imgFiles: this.state.imgFiles.filter((image) => {
        return image != img;
      }),
    });
  };

  onChange = (e) => {
    if (e.target.name == "chosenCategoryId") {
      this.loadSubcategories(e.target.value);
    }

    if (e.target.name == "productName") {
      var nameLength = e.target.value.length;
      var charactersLeft = +PRODUCT_NAME_MAX_CHARACTERS - nameLength;
      this.setState({
        productNameRule:
          PRODUCT_NAME_RULE_MESSAGE +
          " (" +
          charactersLeft +
          CHARACTERS_LEFT_MESSAGE +
          ")",
      });
    }
    if (e.target.name == "description") {
      var descriptionLength = e.target.value.length;
      var charactersLeft = +DESCRIPTION_MAX_CHARACTERS - descriptionLength;
      this.setState({
        descriptionRule:
          DESCRIPTION_RULE_MESSAGE +
          " (" +
          charactersLeft +
          CHARACTERS_LEFT_MESSAGE +
          ")",
      });
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
    var name = productName;
    if (name.trim().indexOf(" ") == -1) {
      this.setState({
        productNameErrMess: PRODUCT_NAME_MIN_WORDS_MESSAGE,
      });
      return false;
    }
    if (name.split(" ").length > 5) {
      this.setState({
        productNameErrMess: PRODUCT_NAME_MAX_WORDS_MESSAGE,
      });
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

    if (description.split(" ").length > 100) {
      this.setState({
        descriptionErrMess: DESCRIPTION_MAX_WORDS_MESSAGE,
      });
      return false;
    }
    return true;
  };

  validateAddedImages = () => {
    const { imgFiles } = this.state;
    if (imgFiles.length < MIN_PHOTOS) {
      this.setState({ imgFilesErrMess: MIN_PHOTOS_NUMER_ERR_MESSAGE });
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
      imgFilesErrMess: "",
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
    if (this.validateAddedImages() == false) {
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
      startDate != "" &&
      new Date().toJSON().slice(0, 10) >
        new Date(startDate).toJSON().slice(0, 10)
    ) {
      this.setState({ startDateErrMess: START_DATE_MIN_VALUE_MESSAGE });
      return false;
    }

    var currentYear = new Date().getFullYear();
    var date = new Date();
    date.setFullYear(currentYear + 1);

    if (
      startDate != "" &&
      new Date(startDate).toJSON().slice(0, 10) >
        new Date(date).toJSON().slice(0, 10)
    ) {
      this.setState({
        startDateErrMess: START_DATE_MAX_VALUE_MESSAGE,
      });
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

    if (startDate != "" && startDate != null) {
      var startDateYear = new Date(startDate).getFullYear();
      var date = new Date(startDate);
      date.setFullYear(startDateYear + 1);

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

  done = async () => {
    if (this.validateSetPricesTab()) {
      try {
        const {
          email,
          token,
          isLoggedIn,
          productName,
          chosenSubcategoryId,
          description,
          startPrice,
          startDate,
          endDate,
          imgFiles,
        } = this.state;

        var startDateValue = new Date(startDate);
        var endDateValue = new Date(endDate);

        var product = {
          name: productName,
          startPrice: startPrice,
          startDate: startDate,
          startDateDay: startDateValue.getDate(),
          startDateMonth: startDateValue.getMonth() + 1,
          startDateYear: startDateValue.getFullYear(),
          endDate: endDate,
          endDateDay: endDateValue.getDate(),
          endDateMonth: endDateValue.getMonth() + 1,
          endDateYear: endDateValue.getFullYear(),
          description: description,
          subcategoryId: chosenSubcategoryId,
        };

        this.setIsLoading(true);
        this.setState({ doneBtnDisabled: true });

        var productId = await this.productService.addProduct(
          product,
          email,
          token,
          this.setIsLoading
        );

        if (productId != null && productId != 0) {
          if (this.state.imgFiles != 0 && this.state.imgFiles.length > 0) {
            var photosSaved = await this.productService.savePhotos(
              imgFiles,
              productId,
              token,
              this.setIsLoading
            );
            if (photosSaved == true) {
              this.setState({ doneBtnDisabled: false });
              this.toastService.showSuccessToast(
                PRODUCT_DATA_SAVED_SUCCESSFULLY
              );
              this.props.history.push({
                pathname: SINGLE_PRODUCT_ROUTE.replace(":prodId", productId),
                state: {
                  chosenProduct: productId,
                  isLoggedIn: isLoggedIn,
                  email: email,
                  token: token,
                },
              });
            }
          }
        }
        this.setIsLoading(false);
      } catch (error) {
        this.setIsLoading(false);
        this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
      }
    }
  };

  setIsLoading = (isLoadingValue) => {
    this.props.setIsLoading(isLoadingValue);
  };

  goBack = () => {
    const { currentTab } = this.state;

    if (currentTab == "setPricesTab") {
      this.setState({ currentTab: "addItemTab" });
      window.scrollTo(0, 0);
    }
  };

  goToNext = () => {
    const { currentTab } = this.state;

    if (currentTab == "addItemTab") {
      if (this.validateAddItemTab()) {
        this.setState({ currentTab: "setPricesTab" });
        window.scrollTo(0, 0);
      }
    }
  };

  handleDescriptionChange = (val) => {
    if (
      val !== undefined &&
      val.doc !== undefined &&
      val.doc.content !== undefined &&
      val.doc.content[0].content
    ) {
      this.setState({ description: val.doc.content[0].content[0].text });
    } else {
      this.setState({ description: "" });
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
      imgFiles,
      imgFilesErrMess,
      productNameRule,
      descriptionRule,
      doneBtnDisabled,
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
                        handleDescriptionChange={this.handleDescriptionChange}
                        addChosenImage={this.addChosenImage}
                        imgFiles={imgFiles}
                        imgFilesErrMess={imgFilesErrMess}
                        productNameRule={productNameRule}
                        descriptionRule={descriptionRule}
                        removeImage={this.removeImage}
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
                        doneBtnDisabled={doneBtnDisabled}
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
