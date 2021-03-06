import React, { Component } from "react";
import { ThemeProvider } from "react-bootstrap";
import { BID_REGEX, ID_REGEX } from "../../constants/regex";
import { BID_MAXIMUM_PRICE } from "../../constants/bidPrice";
import BidService from "../../services/bidService";
import ProductService from "../../services/productService";
import ToastService from "../../services/toastService";
import Heading from "../common/Heading";
import styles from "./SingleProduct.css";
import {
  BID_FORMAT_MESSAGE,
  BID_PRICE_BIGGER_THAN_HIGHEST_BID_MESSAGE,
  BID_PRICE_CAN_NOT_BE_0_MESSAGE,
  BID_PRICE_CAN_NOT_BE_NEGATIVE,
  BID_PRICE_REQUIRED_MESSAGE,
  CONNECTION_REFUSED_MESSAGE,
  EMAIL_FORMAT_MESSAGE,
  LOGIN_TO_BID_PRODUCT_MESSAGE,
  MAX_ALLOWED_BID_PRICE,
  PRODUCT_IS_NOT_ACTIVE,
} from "../../constants/messages";
import { NOT_FOUND_ROUTE } from "../../constants/routes";
import { EMAIL, TOKEN } from "../../constants/auth";

export class SingleProduct extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    productId: null,
    product: null,
    isLoggedIn: false,
    images: null,
    mainImage: null,
    mainImageIndex: 0,
    bids: null,
    email: "",
    token: "",
    placedBid: "",
    isBidPlaced: null,
    placeBidErrorMessage: null,
    placeBidMessage: null,
    placeBidSuccesMessage: null,
  };
  productService = new ProductService();
  bidService = new BidService();
  toastService = new ToastService();
  characterArrow = ">";

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.location.state != null) {
      if (
        prevProps.location.state.chosenProduct !==
        this.props.location.state.chosenProduct
      ) {
        this.componentDidMount();
      }
    }
  };

  async componentDidMount() {
    try {
      var chosenProduct = 0;
      var isLoggedIn = false;
      var email = "";
      var token = "";

      if (this.props.location == null || this.props.location.state == null) {
        chosenProduct = this.props.match.params.prodId;

        const re = ID_REGEX;

        if (!re.test(String(chosenProduct))) {
          this.props.history.push(NOT_FOUND_ROUTE);
          return;
        }

        if (localStorage.getItem(TOKEN) != null) {
          isLoggedIn = true;
          email = localStorage.getItem(EMAIL);
          token = localStorage.getItem(TOKEN);
        }
      } else {
        chosenProduct = this.props.location.state.chosenProduct;
        isLoggedIn = this.props.location.state.isLoggedIn;
        email = this.props.location.state.email;
        token = this.props.location.state.token;
      }

      this.state.productId = chosenProduct;
      this.state.isLoggedIn = isLoggedIn;
      this.state.email = email;
      this.state.token = token;

      this.setIsLoading(true);

      const product = await this.productService.getProductById(chosenProduct);
      const bids = await this.bidService.getBidsByProductId(chosenProduct);

      if (product == null) {
        this.setIsLoading(false);
        this.props.history.push(NOT_FOUND_ROUTE);
        return;
      }

      this.setState({
        isLoggedIn: isLoggedIn,
        product: product,
        bids: bids,
        placeBidErrorMessage: null,
        placeBidSuccesMessage: null,
        placedBid: "",
        mainImage: product.imageList[this.state.mainImageIndex],
      });

      this.setState({
        images: product.imageList.filter((image) => {
          return image.id != this.state.mainImage.id;
        }),
      });

      this.setIsLoading(false);
    } catch (error) {
      this.setIsLoading(false);
      this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
    }
  }

  setIsLoading = (isLoadingValue) => {
    this.props.setIsLoading(isLoadingValue);
  };

  changeToMainImage(index) {
    this.setState({
      mainImageIndex: index,
      mainImage: this.state.images[index],
    });

    this.state.images.splice(index, 1);
    this.setState({ images: [...this.state.images, this.state.mainImage] });
  }

  validateBidFormat(bid) {
    bid.toString();
    const re = BID_REGEX;
    return re.test(String(bid));
  }

  validatePlacedBid() {
    const { placedBid } = this.state;

    if (placedBid === "") {
      this.setState({
        placeBidErrorMessage: BID_PRICE_REQUIRED_MESSAGE,
      });
      return false;
    }

    if (this.validateBidFormat(placedBid) == false) {
      this.setState({
        placeBidErrorMessage: BID_FORMAT_MESSAGE,
      });
      return false;
    } else if (placedBid > BID_MAXIMUM_PRICE) {
      this.setState({
        placeBidErrorMessage: MAX_ALLOWED_BID_PRICE,
      });
      return false;
    } else if (placedBid == 0) {
      this.setState({ placeBidErrorMessage: BID_PRICE_CAN_NOT_BE_0_MESSAGE });
      return false;
    } else if (placedBid < 0) {
      this.setState({ placeBidErrorMessage: BID_PRICE_CAN_NOT_BE_NEGATIVE });
      return false;
    } else if (placedBid <= this.state.product.highestBid) {
      this.setState({
        placeBidErrorMessage: BID_PRICE_BIGGER_THAN_HIGHEST_BID_MESSAGE,
      });
      return false;
    } else if (this.state.product.startPrice > placedBid) {
      this.setState({
        placeBidErrorMessage:
          "Enter $" + this.state.product.startPrice + " or more.",
      });
      return false;
    }
    return true;
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ placeBidErrorMessage: null, placeBidSuccesMessage: null });

    if (this.validatePlacedBid()) {
      try {
        const { productId, email, placedBid, token } = this.state;
        const BidAdded = await this.bidService.placeBid(
          productId,
          email,
          placedBid,
          token
        );

        if (BidAdded !== undefined && BidAdded !== null) {
          this.setState({ isBidPlaced: BidAdded.bidAdded });
          if (BidAdded.bidAdded) {
            this.setState({
              product: await this.productService.getProductById(productId),
              images: this.state.product.imageList.filter((image, index) => {
                return image.id != this.state.mainImage.id;
              }),
              bids: await this.bidService.getBidsByProductId(productId),
              placeBidSuccesMessage: BidAdded.message,
            });
          } else {
            this.setState({
              placeBidErrorMessage: BidAdded.message,
            });
          }
        }
      } catch (error) {
        this.toastService.showErrorToast(CONNECTION_REFUSED_MESSAGE);
      }
    }
  };
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const {
      placeBidSuccesMessage,
      placeBidErrorMessage,
      mainImage,
      images,
      product,
      isLoggedIn,
      placedBid,
      bids,
    } = this.state;

    return (
      <div>
        <Heading title="SINGLE PRODUCT"></Heading>
        {placeBidSuccesMessage && (
          <div className="succesBidMessage">
            <div className="row message">
              <div className="col-lg-2"></div>
              <div className="col-lg-8">{placeBidSuccesMessage}</div>
              <div className="col-lg-2"></div>
            </div>
          </div>
        )}
        {placeBidErrorMessage != null && (
          <div className="failBidMessage">
            <div className="row message">
              <div className="col-lg-2"></div>
              <div className="col-lg-8">{placeBidErrorMessage}</div>
              <div className="col-lg-2"></div>
            </div>
          </div>
        )}

        <div className="row singleProduct">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 singleProd">
            {product != null && (
              <div className="row productData">
                <div className="col-lg-6">
                  {mainImage != null && (
                    <div className="mainPicture">
                      <img
                        className="productMainImage"
                        src={`data:image/png;base64, ${mainImage.image}`}
                      />
                    </div>
                  )}

                  <div className="row">
                    {images != null &&
                      images.map(
                        function (smallImage, index) {
                          return (
                            <div
                              key={smallImage.id}
                              className="col-lg-3 col-md-3, col-sm-3"
                            >
                              <img
                                className="productSmallImage"
                                src={`data:image/png;base64, ${smallImage.image}`}
                                onClick={() => this.changeToMainImage(index)}
                              />
                            </div>
                          );
                        }.bind(this)
                      )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="productName">{product.name}</div>
                  <div className="productStartsFrom">
                    Starts from - ${product.startPriceText}
                  </div>
                  {isLoggedIn && product.activeProduct && (
                    <div className="placeBidDiv">
                      <form onSubmit={this.onSubmit}>
                        <div>
                          <input
                            className="bidInput"
                            name="placedBid"
                            type="number"
                            value={placedBid}
                            onChange={this.onChange}
                          />
                          <button type="submit" className="placeBidBtn">
                            PLACE BID {this.characterArrow}{" "}
                          </button>
                        </div>

                        {product.highestBid <= 0 && (
                          <div className="minBidValueMessage">
                            Enter ${product.startPriceText} or more
                          </div>
                        )}
                        {product.highestBid > 0 && (
                          <div className="minBidValueMessage">
                            Enter more than $
                            {product.highestBid % 1 != 0
                              ? product.highestBidText
                              : product.highestBidText}
                          </div>
                        )}
                      </form>
                    </div>
                  )}
                  {isLoggedIn === false && product.activeProduct && (
                    <div className="loginMessageDiv">
                      {LOGIN_TO_BID_PRODUCT_MESSAGE}
                    </div>
                  )}
                  {!product.activeProduct && (
                    <div className="loginMessageDiv">
                      {PRODUCT_IS_NOT_ACTIVE}
                    </div>
                  )}
                  <div className="productBidDetails">
                    <div className="bidDetails">
                      Highest bid:{" "}
                      <span className="highestBidText">
                        ${product.highestBidText}
                      </span>
                    </div>
                    <div className="bidDetails">
                      No bids: {product.numberOfBids}
                    </div>
                    <div className="bidDetails">
                      Time left: {product.timeLeft} days
                    </div>
                  </div>
                  <div className="detailsDiv">
                    <div>Details</div>
                    <hr className="detailHRline"></hr>
                    <div className="productDescription">
                      {product.description}{" "}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {product != null && bids != null && bids.length > 0 && (
              <div className="row bidsData">
                <div className="col-lg-12">
                  <div className="row bidDataHeading">
                    <div className="col-lg-8 col-sm-8 col-xs-6">Bider</div>
                    <div className="col-lg-2 col-sm-2 col-xs-3">Date</div>
                    <div className="col-lg-2 col-sm-2 col-xs-3">Bid</div>
                  </div>
                  {bids !== null &&
                    bids.map(function (bid, index) {
                      return (
                        <div
                          key={bid.id}
                          className={
                            "row bidData " +
                            ((index + 1) % 2 === 0 ? "greyDiv" : "normalDiv")
                          }
                        >
                          <div className="col-lg-8 col-sm-8 col-xs-6 biderName">
                            {bid.customerFullName}
                          </div>
                          <div className="col-lg-2 col-sm-2 col-xs-3">
                            {Intl.DateTimeFormat("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(bid.dateOfBidPlacement))}
                          </div>
                          <div
                            className={
                              "div col-lg-2  col-sm-2 col-xs-3 " +
                              (bid.highestBid == true
                                ? "highestBidsPrice"
                                : "bidsPrice")
                            }
                          >
                            $ {bid.bidPriceText}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {product != null && (bids === null || bids.length <= 0) && (
              <div className="noBidsMessage">
                There are still no bids for this product.
              </div>
            )}
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    );
  }
}

export default SingleProduct;
