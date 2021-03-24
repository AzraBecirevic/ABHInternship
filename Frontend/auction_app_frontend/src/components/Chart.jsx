import { faSortNumericUpAlt } from "@fortawesome/free-solid-svg-icons";
import { yellow } from "@material-ui/core/colors";
import React, { Component } from "react";
import { DIV_HIGHT } from "../constants/chart";
import ProductService from "../services/productService";

export class Chart extends Component {
  constructor(props) {
    super(props);
  }

  productService = new ProductService();

  state = {
    chartData: [],
  };

  priceData = [];
  maxProducts = 0;

  componentDidMount = async () => {
    var products =
      this.props.productsProp == null
        ? await this.productService.getProducts()
        : this.props.productsProp;

    this.priceData = await this.productService.getPriceFilterData();

    var chartDataArray = [];
    var min = this.priceData.minPrice;
    var max = this.priceData.maxPrice;
    var incrementValue = 20;

    while (min < max) {
      min = min + incrementValue;
      chartDataArray.push({ groupTopValue: min, productsArray: [] });
    }

    var lastGroupTopValue = this.priceData.minPrice - 1;
    for (let i = 0; i < chartDataArray.length; i++) {
      var groupTopValue = chartDataArray[i].groupTopValue;

      for (let j = 0; j < products.length; j++) {
        if (
          products[j].startPrice > lastGroupTopValue &&
          products[j].startPrice <= groupTopValue
        ) {
          chartDataArray[i].productsArray.push(products[j]);
          if (chartDataArray[i].productsArray.length > this.maxProducts) {
            this.maxProducts = chartDataArray[i].productsArray.length;
          }
        }
      }

      lastGroupTopValue = groupTopValue;
    }

    this.setState({
      chartData: chartDataArray,
    });
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #D8D8D8",
          borderRadius: "1px",
        }}
      >
        {this.state.chartData !== undefined &&
          this.state.chartData !== null &&
          this.state.chartData.map(
            function (chartData, index) {
              return (
                <div key={index} style={{ width: "50px" }}>
                  <div
                    style={{
                      height: `${chartData.productsArray.length * DIV_HIGHT}px`,
                      backgroundColor: "#E4E5EC",

                      marginRight: "0px",
                      marginLeft: "0px",
                      position: "relative",
                      top: `${
                        this.maxProducts * DIV_HIGHT -
                        chartData.productsArray.length * DIV_HIGHT
                      }px`,
                    }}
                  ></div>
                </div>
              );
            }.bind(this)
          )}
      </div>
    );
  }
}

export default Chart;
