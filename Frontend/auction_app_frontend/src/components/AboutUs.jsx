import bids from "../assets/bids.jpg";
import bid from "../assets/bid.jpg";
import bags from "../assets/bags.jpg";
import styles from "./AboutUs.css";
import Heading from "./Heading";

import React, { Component } from "react";

export class AboutUs extends Component {
  render() {
    return (
      <div>
        <Heading title="ABOUT US"></Heading>
        <div className="row about">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <div className="aboutUs">
              <h2 className="aboutHeading">About Us</h2>
              <div className="row">
                <div className="col-lg-6">
                  <div className="aboutTextDiv">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin egestas elementum imperdiet. Aliquam arcu nisl,
                      ultrices sed libero venenatis, eleifend facilisis enim.
                      Nulla eu auctor dui, et suscipit massa. Donec vestibulum
                      sem purus, at pellentesque sapien euismod ut. Duis id urna
                      in velit vestibulum mollis. Cras id congue velit. Nullam
                      neque diam, luctus ultrices dui eget, volutpat egestas
                      est. Integer ligula sem, sollicitudin quis faucibus eget,
                      ultricies sed libero. Maecenas tempor efficitur orci, eu
                      pulvinar nisi bibendum et. Morbi venenatis massa eget
                      massa porttitor suscipit. Nam non mi at augue accumsan
                      semper sed sit amet lacus.
                    </p>
                    <p>
                      Sed sodales nec erat quis porta. Etiam magna massa,
                      commodo eu tincidunt sit amet, laoreet sit amet arcu.
                      Aenean imperdiet efficitur porttitor. Nunc nec dui
                      lobortis, eleifend erat eget, tincidunt arcu. In ut
                      aliquet risus, et tempor sapien. Aliquam pharetra erat
                      eget orci pretium, vel rhoncus magna ultrices. Maecenas a
                      tempus nisl. Cras semper et augue nec lobortis. Nullam
                      placerat eros nec maximus dignissim. Etiam cursus dolor
                      nisl, sed egestas quam interdum non. Praesent felis nulla,
                      tincidunt ut scelerisque quis, faucibus a dui. Quisque
                      varius turpis id ipsum ultrices, quis condimentum dolor
                      tempor. Sed eros risus, faucibus in iaculis quis, congue
                      id dolor. Quisque in mollis nisl.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className=" row aboutImagesDiv">
                    <div className="row aboutImageOne">
                      <div className="col-lg-12">
                        <img className="aboutImage" src={bids} alt="Bids"></img>
                      </div>
                    </div>
                    <div className="row aboutImagesTwo">
                      <div className="col-lg-6">
                        <img className="aboutImage" src={bid} alt="Bid"></img>
                      </div>
                      <div className="col-lg-6">
                        <img className="aboutImage" src={bags} alt="Bags"></img>
                      </div>
                    </div>
                  </div>
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

export default AboutUs;
