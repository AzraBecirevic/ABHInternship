import { BID_MAXIMUM_PRICE } from "./bidPrice";
import { MIN_AGE } from "./userData";

export const PASSWORD_FORMAT_MESSAGE =
  "Password should be 8-16 characters long, have at least one number and one special character";
export const PASSWORD_REQUIRED_MESSAGE = "Password is required";
export const EMAIL_FORMAT_MESSAGE =
  "Expected email format: example@example.com";
export const EMAIL_REQUIRED_MESSAGE = "Email is required";
export const FIRST_NAME_REQUIRED_MESSAGE = "First name is required";
export const LAST_NAME_REQUIRED_MESSAGE = "Last name is required";
export const PHONE_NUMBER_REQUIRED_MESSAGE = "Phone number is required";
export const PHONE_NUMBER_FORMAT_MESSAGE =
  "Please provide correct phone number format of your country.";
export const GENDER_REQIURED_MESSAGE = "Gender is required.";
export const MUST_BE_OLDER_THAN_MESSAGE =
  "Please provide your date of birth. You must be older than " + MIN_AGE;
export const BID_PRICE_REQUIRED_MESSAGE = "You need to enter bid price.";
export const BID_FORMAT_MESSAGE = "Bid can have up to two decimal places";
export const MAX_ALLOWED_BID_PRICE =
  "Maximum allowed bid is $" + BID_MAXIMUM_PRICE;
export const BID_PRICE_CAN_NOT_BE_0_MESSAGE = "Bid price can not be 0.";
export const BID_PRICE_CAN_NOT_BE_NEGATIVE = "Bid price can not be negative.";
export const BID_PRICE_BIGGER_THAN_HIGHEST_BID_MESSAGE =
  "Enter price bigger than highest bid.";
export const CONNECTION_REFUSED_MESSAGE =
  "Connection refused. Please try later.";
export const SUCCESSFUL_LOGIN_MESSAGE = "You have successfully logged in.";
export const FAIL_LOGIN_MESSAGE = "Incorrect email or password.";
export const SUCCESSFUL_REGISTER_MESSAGE = "You have successfully registered.";
export const SUCCESSFUL_PASSWORD_CHANGE_MESSAGE =
  "You have successfully changed your password.";
export const FAILED_PASSWORD_CHANGE_MESSAGE =
  "Please create account if you don't have an acconut.";
export const FORBIDDEN_PASSWORD_CHANGE_MESSAGE =
  "Please sign up or log in to continue";
export const PASSWORD_RESET_MAIL_SUCCESSFULLY_SENT_MESSAGE =
  "We have successfully sent a password reset link to your email address";
export const PASSWORD_RESET_MAIL_FAILED_SENT_MESSAGE =
  "There is no user associated with this account.";
export const PAGE_NOT_FOUND_MESSAGE = "Ooops! Looks like the page is Not Found";
export const GO_BACK_MESSAGE = "GO BACK";
export const START_CHOSING_FILTERS =
  "Start by chosing a category or subcategory";
export const NO_MORE_PRODUCTS_MESSAGE = "There are no more products to show.";
export const NO_PRODUCTS_IN_CATEGORY_MESSAGE =
  "There are no products in this category.";
export const LOADING_PRODUCTS_MESSAGE = "Loading...";
export const PRICE_FILTER_HEADING = "FILTER BY PRICE";
export const CATEGORY_MENU_HEADING = "PRODUCT CATEGORIES";
export const AVERAGE_PRICE_MESSAGE = "The average price is $";
export const NO_PRODUCTS_IN_PRICE_RANGE =
  "There are no products in this price range.";
export const GRID_VIEW = "Grid";
export const LIST_VIEW = "List";
export const ACCESS_ACOUNT_PAGE = "Please login to acces your account page.";
export const ACCOUNT_PAGE_TITLE = "My Account";
export const SUCCESSFUL_CUSTOMER_UPDATE_MESSAGE =
  "You have successfully changed your data.";
export const SUCCESSFUL_CUSTOMER_UPDATE_LOGIN_MESSAGE =
  "You have successfully changed your data. Since you have changed your email, please login with your new email.";
export const CITY_REQUIRED_MESSAGE = "City is required";
export const CITY_FORMAT_MESSAGE = "Only characters, maximum 40";
export const ZIP_CODE_REQUIRED_MESSAGE = "Zip code is required";
export const ZIP_CODE_FORMAT_MESSAGE =
  "Expected zip code format: 11111 or 11111-1111";
export const STREET_REQUIRED_MESSAGE = "Street is required";
export const STREET_FORMAT_MESSAGE =
  "Characters, numbers, dots and commas allowed, 60 characters is maximum";
export const COUNTRY_REQUIRED_MESSAGE = "Country is required";
export const REGION_REQUIRED_MESSAGE = "State is required";
export const NO_ITEMS_FOR_SALE_MESSAGE =
  "You do not have any scheduled items for sale.";
export const NO_PRODUCTS_TO_SHOW_MESSAGE = "There are no products to show.";
export const DEACTIVATE_ACCOUNT_QUESTION_MESSAGE =
  "Do you want to deactivate account?";
export const SUCCESSFULLY_DEACTIVATED_ACOUNT_MESSAGE =
  "Your account has been successfully deactivated.";
export const NOT_DEACTIVATED_ACOUNT_MESSAGE =
  "Your account can not be deactivated right now. Please try later.";
export const NOT_ACTIVE_ACCOUNT_MESSAGE =
  "Your acount is deactivated. You can not log in.";
export const PRODUCT_IS_NOT_ACTIVE =
  "Product is not available for bidding anymore.";
export const LOGIN_TO_BID_PRODUCT_MESSAGE =
  "If you would like to place a bid, please log in.";
export const DEACTIVATE = "DEACTIVATE";
export const ACTIVE = "Active";
export const SOLD_ITEMS = "Sold";
export const ADD_ITEM = "ADD ITEM";
export const START_SELLING = "START SELLING";
export const REQUIRED = "REQUIRED";
export const CHANGE_PHOTO = "CHANGE PHOTO";
export const CARD_INFORMATION = "CARD INFORMATION";
export const OPTIONAL = "OPTIONAL";
export const SAVE_INFO = "SAVE INFO";
export const NO_SEARCHED_PRODUCTS = "There are no searched products.";
