import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  DESCRIPTION_RULE_MESSAGE,
  PRODUCT_NAME_RULE_MESSAGE,
} from "../constants/messages";

export class AddItemInfo extends Component {
  render() {
    const {
      productName,
      productNameErrMess,
      categoryList,
      chosenCategoryId,
      chosenCategoryIdErrMess,
      subcategoryList,
      chosenSubcategoryId,
      chosenSubcategoryIdErrMess,
      description,
      descriptionErrMess,
    } = this.props;

    return (
      <div className="userInfoDiv">
        <div className="userInfoDivHeading startSelling">ADD ITEM</div>
        <div className="tabFormDiv">
          <form>
            <div className="formDataGroup">
              <label className="formLabel">What do you sell?</label>
              <input
                type="text"
                name="productName"
                className="form-control"
                value={productName}
                onChange={this.props.onChange}
              />
              <div className="ruleMessage">{PRODUCT_NAME_RULE_MESSAGE}</div>
              <small
                className="errorMessage"
                hidden={productNameErrMess === ""}
              >
                {productNameErrMess}
              </small>
            </div>

            <div className="formDataGroup">
              <div className="cityZipCodeDiv categorySubcategory">
                <div className="cityInput">
                  <label className="formLabel"></label>

                  <select
                    className="form-control selectCategoryDiv selectData"
                    name="chosenCategoryId"
                    value={chosenCategoryId}
                    onChange={this.props.onChange}
                  >
                    <option value={0} defaultValue={chosenCategoryId == 0}>
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
                <div className="cityInput">
                  <label className="formLabel"></label>

                  <select
                    className="form-control selectCategoryDiv selectData"
                    name="chosenSubcategoryId"
                    value={chosenSubcategoryId}
                    onChange={this.props.onChange}
                  >
                    <option value={0} defaultValue={chosenSubcategoryId == 0}>
                      Select subcategory
                    </option>
                    {subcategoryList !== null &&
                      subcategoryList.map(function (subcategory, index) {
                        return (
                          <option value={subcategory.id} key={index}>
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
              </div>
            </div>

            <div className="formDataGroup"></div>

            <div className="formDataGroup">
              <label className="formLabel">Description</label>
              <textarea
                name="description"
                rows={5}
                className="form-control"
                value={description}
                onChange={this.props.onChange}
              />
              <div className="ruleMessage">{DESCRIPTION_RULE_MESSAGE}</div>
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
              onClick={this.props.goToNext}
            >
              NEXT{" "}
              <FontAwesomeIcon
                icon={faChevronRight}
                size={"sm"}
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddItemInfo;
