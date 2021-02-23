import React from 'react'
import Heading from './Heading'
import styles from './PrivacyAndPolicy.css'
import TextHelper from './TextHelper'

const PrivacyAndPolicy = () => {
    return (
        <div>
            <Heading title="PRIVACY AND POLICY"></Heading>
            <div className="container">
                <div className="row">
                    <div className="col-lg-2"></div>
                    <div className="col-lg-8">
                        <div className="privacyPolicyDiv">
                            <h2 className="policyHeading">Privacy Policy</h2>
                            <div className="privacyTextDiv">
                                <p>At Auction Application, accessible from http://localhost:3000/about, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Auction Application and how we use it.</p>
                                <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. Our Privacy Policy was created with the help of the <a className="linkPolicy" href="https://www.generateprivacypolicy.com">Privacy Policy Generator</a>.</p>
                            </div>
                            <TextHelper title={"Log Files"} text="Auction Application follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information."></TextHelper>
                            <h5 className="policySubTitle">Cookies and Web Beacons</h5>
                            <div className="privacyTextDiv">
                                <p>Like any other website, Auction Application uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
                                <p>For more general information on cookies, please read <a className="linkPolicy" href="https://www.cookieconsent.com/what-are-cookies/">"What Are Cookies" from Cookie Consent</a>.</p>
                            </div>
                            <h5 className="policySubTitle">Google DoubleClick DART Cookie</h5>
                            <div className="privacyTextDiv">
                                <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a className="linkPolicy" href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a></p>
                            </div>
                            <h5 className="policySubTitle">Our Advertising Partners</h5>
                            <div className="privacyTextDiv">
                                <p>Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.</p>
                                <ul>
                                    <li>
                                        <p>Google</p>
                                        <p><a className="linkPolicy" href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a></p>
                                    </li>
                                </ul>
                            </div>
                            <TextHelper title={"Privacy Policies"} text={"You may consult this list to find the Privacy Policy for each of the advertising partners of Auction Application. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Auction Application, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. Note that Auction Application has no access to or control over these cookies that are used by third-party advertisers."}></TextHelper>
                            <TextHelper title={"Third Party Privacy Policies"} text={"Auction Application's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites. What Are Cookies?"}></TextHelper>
                            <TextHelper title={"Children's Information"} text={"Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Auction Application does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records."}></TextHelper>
                            <TextHelper title={"Online Privacy Policy Only"} text={"This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Auction Application. This policy is not applicable to any information collected offline or via channels other than this website."}></TextHelper>
                            <TextHelper title={"Consent"} text={"By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions."}></TextHelper>
                        </div>
                    </div>
                    <div className="col-lg-2"></div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyAndPolicy
