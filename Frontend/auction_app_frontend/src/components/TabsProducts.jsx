import React, { Component } from "react";
import { Link } from "react-router-dom";

export class TabsProducts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-2"></div>
        <div className="col-lg-12">
          <div className="row">
            {this.props.array != null &&
              this.props.array.map(function (product) {
                return (
                  <div
                    className="col-sm-12 col-md-6 col-lg-4"
                    key={product.id}
                    style={{ marginTop: "40px" }}
                  >
                    <img
                      className="tabProductImage"
                      src={`data:image/png;base64, ${product.image}`}
                    />

                    <div>
                      <a className="productNameLink">{product.name}</a>
                    </div>
                    <div className="startsFrom">
                      Starts from ${product.startPrice}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-lg-2"></div>
      </div>
    );
  }
}

export default TabsProducts;
