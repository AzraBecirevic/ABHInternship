import React, { Component } from "react";
import { Link } from "react-router-dom";

export class TabsProducts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="row imagetiles">
            {this.props.array != null &&
              this.props.array.map(function (product) {
                return (
                  <div
                    className="col-lg-3 col-md-3 col-sm-6 col-xs-6 tabsProductDiv"
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
      </div>
    );
  }
}

export default TabsProducts;
