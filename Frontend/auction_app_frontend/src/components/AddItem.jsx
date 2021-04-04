import React, { Component } from "react";
import Heading from "./Heading";
import CategoryService from "../services/categoryService";
import SubcategoryService from "../services/subcategoryService";

import styles from "./AddItem.css";
import InputGroupWithExtras from "react-bootstrap/esm/InputGroup";
import { TextField } from "@material-ui/core";
import { FormText } from "react-bootstrap";

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
    console.log(e.target.value); //
    if (e.target.name == "chosenCategoryId") {
      this.loadSubcategories(e.target.value);
    }
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state.chosenCategoryId); //
  };

  goToSetPricesTab = () => {
    this.setState({ currentTab: "setPricesTab" });
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
                      <div className="userInfoDiv">
                        <div className="userInfoDivHeading startSelling">
                          ADD ITEM
                        </div>
                        <div className="tabFormDiv">
                          <form>
                            <div className="formDataGroup">
                              <label className="formLabel">
                                What do you sell?
                              </label>
                              <input
                                type="text"
                                name="productName"
                                className="form-control"
                                value={productName}
                                onChange={this.onChange}
                              />
                              <small
                                className="errorMessage"
                                hidden={productNameErrMess === ""}
                              >
                                {productNameErrMess}
                              </small>
                            </div>

                            <div className="formDataGroup">
                              <label className="formLabel"></label>

                              <select
                                className="form-control selectCategoryDiv selectData"
                                name="chosenCategoryId"
                                value={chosenCategoryId}
                                onChange={this.onChange}
                              >
                                <option
                                  value={0}
                                  defaultValue={chosenCategoryId == 0}
                                >
                                  Select category
                                </option>
                                {categoryList !== null &&
                                  categoryList.map(function (category, index) {
                                    return (
                                      <option value={category.id} key={index}>
                                        {category.name}
                                      </option>
                                    );
                                  })}
                              </select>
                              <small
                                className="errorMessage"
                                hidden={chosenCategoryIdErrMess === ""}
                              >
                                {chosenCategoryIdErrMess}
                              </small>
                            </div>
                            {chosenCategoryId !== 0 && (
                              <div className="formDataGroup">
                                <label className="formLabel"></label>

                                <select
                                  className="form-control selectCategoryDiv selectData"
                                  name="chosenSubcategoryId"
                                  value={chosenSubcategoryId}
                                  onChange={this.onChange}
                                >
                                  <option
                                    value={0}
                                    defaultValue={chosenSubcategoryId == 0}
                                  >
                                    Select subcategory
                                  </option>
                                  {subcategoryList !== null &&
                                    subcategoryList.map(function (
                                      subcategory,
                                      index
                                    ) {
                                      return (
                                        <option
                                          value={subcategory.id}
                                          key={index}
                                        >
                                          {subcategory.name}
                                        </option>
                                      );
                                    })}
                                </select>
                                <small
                                  className="errorMessage"
                                  hidden={chosenSubcategoryIdErrMess === ""}
                                >
                                  {chosenSubcategoryIdErrMess}
                                </small>
                              </div>
                            )}
                            <div className="formDataGroup">
                              <label className="formLabel">Description</label>
                              <textarea
                                name="description"
                                rows={5}
                                className="form-control"
                                value={description}
                                onChange={this.onChange}
                              />
                              <small
                                className="errorMessage"
                                hidden={descriptionErrMess === ""}
                              >
                                {descriptionErrMess}
                              </small>
                            </div>
                            <div>Upload photos</div>
                          </form>
                          <div className="nextBackDoneBtnDivAddItem">
                            <button
                              className="btnBackNext nextBtnAddItem"
                              onClick={this.goToSetPricesTab}
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {currentTab == "setPricesTab" && (
                      <div className="userInfoDiv">
                        <div className="userInfoDivHeading startSelling">
                          SET PRICES
                        </div>
                        <div className="tabFormDiv">
                          <form>
                            <div className="formDataGroup">
                              <label className="formLabel">
                                Your start price
                              </label>
                              <div className="startPriceInputDiv">
                                <div className="starPriceValuteDiv">$</div>
                                <input
                                  type="number"
                                  name="startPrice"
                                  className="form-control setPrices"
                                  value={startPrice}
                                  onChange={this.onChange}
                                />
                              </div>

                              <small
                                className="errorMessage"
                                hidden={startPriceErrMessage === ""}
                              >
                                {startPriceErrMessage}
                              </small>
                            </div>
                            <div className="formDataGroup">
                              <div className="cityZipCodeDiv">
                                <div className="cityInput">
                                  <label className="formLabel">
                                    Start date
                                  </label>
                                  <input
                                    type="date"
                                    name="startDate"
                                    className="form-control setPrices"
                                    value={startDate}
                                    onChange={this.onChange}
                                  />
                                  <small
                                    className="errorMessage"
                                    hidden={startDateErrMess === ""}
                                  >
                                    {startDateErrMess}
                                  </small>
                                </div>
                                <div className="cityInput">
                                  <label className="formLabel">End date</label>
                                  <input
                                    type="date"
                                    name="endDate"
                                    className="form-control setPrices"
                                    value={endDate}
                                    onChange={this.onChange}
                                  />
                                  <small
                                    className="errorMessage"
                                    hidden={endDateErrMess === ""}
                                  >
                                    {endDateErrMess}
                                  </small>
                                </div>
                              </div>
                              <div className="startEndDateMessageDiv">
                                The auction will be automatically closed when
                                the end time comes. The highest bid will win the
                                auction.
                              </div>
                            </div>
                          </form>
                          <div className="nextBackDoneBtnDivSetPrices">
                            <button className="btnBackNext backBtnAddItem">
                              BACK
                            </button>
                            <button className="btnBackNext nextBtnAddItem">
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
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
