import React, { Component } from "react";
import { ThemeProvider } from "react-bootstrap";
import { BID_REGEX } from "../constants/regex";
import { BID_MAXIMUM_PRICE } from "../constants/bidPrice";
import BidService from "../services/bidService";
import ProductService from "../services/productService";
import ToastService from "../services/toastService";
import Heading from "./Heading";
import styles from "./SingleProduct.css";

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

  async componentDidMount() {
    try {
      const {
        chosenProduct,
        isLoggedIn,
        email,
        token,
      } = this.props.location.state;
      this.state.productId = chosenProduct;
      this.state.isLoggedIn = isLoggedIn;
      this.state.email = email;
      this.state.token = token;

      this.setState({
        product: await this.productService.getProductById(chosenProduct),
      });
      this.setState({ images: this.state.product.imageList });
      this.setState({
        mainImage: this.state.images[this.state.mainImageIndex],
      });
      this.setState({
        images: this.state.images.filter((image) => {
          return image.id != this.state.mainImage.id;
        }),
      });
      this.setState({
        bids: await this.bidService.getBidsByProductId(chosenProduct),
      });
    } catch (error) {
      this.toastService.showErrorToast("Connection refused. Please try later.");
    }
  }

  changeToMainImage(index) {
    this.setState({ mainImageIndex: index });

    this.setState({
      mainImage: this.state.images[index],
    });

    this.state.images.splice(index, 1);
    this.setState({ images: [...this.state.images] });

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
        placeBidErrorMessage: "You need to enter bid price.",
      });
      return false;
    }

    if (this.validateBidFormat(placedBid) == false) {
      this.setState({
        placeBidErrorMessage: "Bid can have up to two decimal places",
      });
      return false;
    } else if (placedBid > BID_MAXIMUM_PRICE) {
      this.setState({
        placeBidErrorMessage: "Maximum allowed bid is $" + BID_MAXIMUM_PRICE,
      });
      return false;
    } else if (placedBid == 0) {
      this.setState({ placeBidErrorMessage: "Bid price can not be 0." });
      return false;
    } else if (placedBid < 0) {
      this.setState({ placeBidErrorMessage: "Bid price can not be negative." });
      return false;
    } else if (placedBid <= this.state.product.highestBid) {
      this.setState({
        placeBidErrorMessage: "Enter price bigger than highest bid.",
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
        const isBidAdded = await this.bidService.placeBid(
          productId,
          email,
          placedBid,
          token
        );

        this.setState({ isBidPlaced: isBidAdded });
        if (isBidAdded) {
          this.setState({
            product: await this.productService.getProductById(productId),
            images: this.state.product.imageList.filter((image, index) => {
              return image.id != this.state.mainImage.id;
            }),
            bids: await this.bidService.getBidsByProductId(productId),
            placeBidSuccesMessage: "Congrats! You are the highest bidder!",
          });
        }
      } catch (error) {
        this.toastService.showErrorToast(
          "Connection refused. Please try later."
        );
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
                  {isLoggedIn && (
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
                  {isLoggedIn === false && (
                    <div className="loginMessageDiv">
                      If you would like to place a bid, please log in.
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
            {bids != null && bids.length > 0 && (
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
            {(bids === null || bids.length <= 0) && (
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
