import React, { Component } from "react";
import { ThemeProvider } from "react-bootstrap";
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

  render() {
    return (
      <div>
        <Heading title="SINGLE PRODUCT"></Heading>
        <div className="row singleProduct">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 singleProd">
            {this.state.product != null && (
              <div className="row productData">
                <div className="col-lg-6">
                  {this.state.mainImage != null && (
                    <div className="mainPicture">
                      <img
                        className="productMainImage"
                        src={`data:image/png;base64, ${this.state.mainImage.image}`}
                      />
                    </div>
                  )}

                  <div className="row">
                    {this.state.images != null &&
                      this.state.images.map(
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
                  <div className="productName">{this.state.product.name}</div>
                  <div className="productStartsFrom">
                    Starts from - ${this.state.product.startPrice}
                  </div>
                  {this.state.isLoggedIn && (
                    <div className="placeBidDiv">
                      <form>
                        <div>
                          <input
                            className="bidInput"
                            name="bidValue"
                            type="text"
                          />
                          <button className="placeBidBtn">
                            PLACE BID {this.characterArrow}{" "}
                          </button>
                        </div>
                        <div className="minBidValueMessage">
                          Enter ${this.state.product.highestBid} or more
                        </div>
                      </form>
                    </div>
                  )}
                  {this.state.isLoggedIn === false && (
                    <div className="loginMessageDiv">
                      If you would like to place a bid, please log in.
                    </div>
                  )}
                  <div className="productBidDetails">
                    <div className="bidDetails">
                      Highest bid:{" "}
                      <span className="highestBidText">
                        {this.state.product.highestBid}
                      </span>
                    </div>
                    <div className="bidDetails">
                      No bids: {this.state.product.numberOfBids}
                    </div>
                    <div className="bidDetails">
                      Time left: {this.state.product.timeLeft} days
                    </div>
                  </div>
                  <div className="detailsDiv">
                    <div>Details</div>
                    <hr className="detailHRline"></hr>
                    <div className="productDescription">
                      {this.state.product.description}{" "}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.state.bids != null && this.state.bids.length > 0 && (
              <div className="row bidsData">
                <div className="col-lg-12">
                  <div className="row bidDataHeading">
                    <div className="col-lg-8 col-sm-8 col-xs-6">Bider</div>
                    <div className="col-lg-2 col-sm-2 col-xs-3">Date</div>
                    <div className="col-lg-2 col-sm-2 col-xs-3">Bid</div>
                  </div>
                  {this.state.bids !== null &&
                    this.state.bids.map(function (bid, index) {
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
                            $ {bid.bidPrice}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {(this.state.bids === null || this.state.bids.length <= 0) && (
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
