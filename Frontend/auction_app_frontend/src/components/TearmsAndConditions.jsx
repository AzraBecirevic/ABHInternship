import Heading from "./Heading";
import styles from "./TearmsAndConditions.css";
import TextHelper from "./TextHelper";

import React, { Component } from "react";

export class TearmsAndConditions extends Component {
  render() {
    return (
      <div>
        <Heading title="TEARMS AND CONDITIONS"></Heading>
        <div className="container">
          <div className="row">
            <div className="col-lg-1"></div>
            <div className="col-lg-10">
              <div className="tearmsConditionsDiv">
                <h2 className="tearmsHeading">Introduction</h2>
                <div className="termsTextDiv">
                  <p className="tearmsText">
                    These Website Standard Terms and Conditions written on this
                    webpage shall manage your use of our website, Auction
                    Application accessible at http://localhost:3000/about.
                  </p>
                  <p className="tearmsText">
                    These Terms will be applied fully and affect to your use of
                    this Website. By using this Website, you agreed to accept
                    all terms and conditions written in here. You must not use
                    this Website if you disagree with any of these Website
                    Standard Terms and Conditions. These Terms and Conditions
                    have been generated with the help of the{" "}
                    <a
                      className="linkTearms"
                      href="https://www.termsandcondiitionssample.com"
                    >
                      Terms And Conditiions Sample
                    </a>{" "}
                    and the{" "}
                    <a
                      className="linkTearms"
                      href="https://www.generateprivacypolicy.com"
                    >
                      Privacy Policy Generator
                    </a>
                    .
                  </p>
                  <p className="tearmsText">
                    Minors or people below 18 years old are not allowed to use
                    this Website.
                  </p>
                </div>
                <TextHelper
                  title={"Intellectual Property Rights"}
                  text={
                    "Other than the content you own, under these Terms, Auction and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website."
                  }
                ></TextHelper>
                <h5 className="tearmsSubTitle">Restrictions</h5>
                <div className="termsTextDiv">
                  <p className="tearmsText">
                    You are specifically restricted from all of the following:
                  </p>
                  <ul>
                    <li className="tearmsListItem">
                      publishing any Website material in any other media;
                    </li>
                    <li className="tearmsListItem">
                      selling, sublicensing and/or otherwise commercializing any
                      Website material;
                    </li>
                    <li className="tearmsListItem">
                      publicly performing and/or showing any Website material;
                    </li>
                    <li className="tearmsListItem">
                      using this Website in any way that is or may be damaging
                      to this Website;
                    </li>
                    <li className="tearmsListItem">
                      using this Website in any way that impacts user access to
                      this Website;
                    </li>
                    <li className="tearmsListItem">
                      using this Website contrary to applicable laws and
                      regulations, or in any way may cause harm to the Website,
                      or to any person or business entity;
                    </li>
                    <li className="tearmsListItem">
                      engaging in any data mining, data harvesting, data
                      extracting or any other similar activity in relation to
                      this Website;
                    </li>
                    <li className="tearmsListItem">
                      using this Website to engage in any advertising or
                      marketing.
                    </li>
                  </ul>
                  <p className="tearmsText">
                    Certain areas of this Website are restricted from being
                    access by you and Auction may further restrict access by you
                    to any areas of this Website, at any time, in absolute
                    discretion. Any user ID and password you may have for this
                    Website are confidential and you must maintain
                    confidentiality as well.
                  </p>
                </div>
                <TextHelper
                  title={"Your Content"}
                  text={
                    "In these Website Standard Terms and Conditions, 'Your Content' shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Auction a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media. Your Content must be your own and must not be invading any third-party’s rights. Auction reserves the right to remove any of Your Content from this Website at any time without notice."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Your Privacy"}
                  text={"Please read Privacy Policy."}
                ></TextHelper>
                <TextHelper
                  title={"No warranties"}
                  text={
                    "This Website is provided 'as is,' with all faults, and Auction express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Limitation of liability"}
                  text={
                    "In no event shall Auction, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.  Auction, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Indemnification"}
                  text={
                    "You hereby indemnify to the fullest extent Auction from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Severability"}
                  text={
                    "If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Variation of Terms"}
                  text={
                    "Auction is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Assignment"}
                  text={
                    "The Auction is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Entire Agreement"}
                  text={
                    "These Terms constitute the entire agreement between Auction and you in relation to your use of this Website, and supersede all prior agreements and understandings."
                  }
                ></TextHelper>
                <TextHelper
                  title={"Governing Law & Jurisdiction"}
                  text={
                    "These Terms will be governed by and interpreted in accordance with the laws of the State of ba, and you submit to the non-exclusive jurisdiction of the state and federal courts located in ba for the resolution of any disputes."
                  }
                ></TextHelper>
              </div>
            </div>
            <div className="col-lg-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default TearmsAndConditions;
