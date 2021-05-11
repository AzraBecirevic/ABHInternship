import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  DESCRIPTION_RULE_MESSAGE,
  MIN_PHOTOS_NUMBER_MESSAGE,
  OR_DRAG_AND_DROP_MESSAGE,
  PRODUCT_NAME_RULE_MESSAGE,
  UPLOAD_PHOTOS_MESSAGE,
} from "../../constants/messages";
import Editor from "nib-core";
import Dropzone from "react-dropzone";

export class AddItemInfo extends Component {
  saveFiles = (acceptedFiles) => {
    var array = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      array.push(acceptedFiles[i]);
    }

    this.props.addChosenImage(array[0]);
  };

  removeImage = (img) => {
    this.props.removeImage(img);
  };
  onSubmit = (e) => {
    e.preventDefault();
  };

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
      imgFiles,
      imgFilesErrMess,
      productNameRule,
      descriptionRule,
    } = this.props;

    return (
      <div className="userInfoDiv">
        <div className="userInfoDivHeading startSelling">ADD ITEM</div>
        <div className="tabFormDiv">
          <form onSubmit={this.onSubmit}>
            <div className="formDataGroup">
              <label className="formLabel">What do you sell?</label>
              <input
                type="text"
                name="productName"
                maxLength="60"
                className="form-control"
                value={productName}
                onChange={this.props.onChange}
              />
              <div className="ruleMessage">{productNameRule}</div>
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
                maxLength="700"
                onChange={this.props.onChange}
              />
              <div id="example"></div>
              <div className="ruleMessage">{descriptionRule}</div>
              <small
                className="errorMessage"
                hidden={descriptionErrMess === ""}
              >
                {descriptionErrMess}
              </small>
            </div>
            <div
              className={
                imgFiles == null || imgFiles.length <= 0
                  ? "dragDropDivEmpty"
                  : "dragDropDiv"
              }
            >
              <Dropzone
                accept="image/*"
                onDrop={(acceptedFiles) => {
                  console.log(acceptedFiles);
                  this.saveFiles(acceptedFiles);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div
                        className={
                          imgFiles == null || imgFiles.length <= 0
                            ? "dragDropInputDivEmpty"
                            : "dragDropInputDiv"
                        }
                      >
                        <div className="dragDropTextDiv">
                          {" "}
                          <p>
                            <span className="purpleDropText">
                              {UPLOAD_PHOTOS_MESSAGE}
                            </span>
                            {"  "}
                            <span className="normalDropText">
                              {OR_DRAG_AND_DROP_MESSAGE}
                            </span>
                          </p>
                          <p className="normalDropText">
                            {MIN_PHOTOS_NUMBER_MESSAGE}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
              <div className="imgPreviewDiv">
                <p
                  className="imgPreviewTitle"
                  hidden={imgFiles == null || imgFiles.length <= 0}
                >
                  Image preview
                </p>
                <div className="imgPreviewListDiv">
                  {imgFiles != null &&
                    imgFiles.map(
                      function (img) {
                        return (
                          <div>
                            <img
                              className="productImgPreview"
                              src={img.imgPreview}
                            ></img>
                            <div
                              className="imgPreviewRemove"
                              onClick={() => this.removeImage(img)}
                            >
                              Remove
                            </div>
                          </div>
                        );
                      }.bind(this)
                    )}
                </div>
              </div>
            </div>
            <small className="errorMessage" hidden={imgFilesErrMess === ""}>
              {imgFilesErrMess}
            </small>
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
