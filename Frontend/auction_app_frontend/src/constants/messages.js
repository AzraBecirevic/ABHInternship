import { BID_MAXIMUM_PRICE, START_PRICE_MAXIMUM_VALUE } from "./bidPrice";
import {
  DESCRIPTION_MAX_CHARACTERS,
  MAX_PHOTOS,
  MIN_PHOTOS,
  PRODUCT_NAME_MAX_CHARACTERS,
} from "./product";
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
export const PRODUCT_NAME_RULE_MESSAGE = "2-5 words";
export const DESCRIPTION_RULE_MESSAGE = "100 words";
export const PRODUCT_DATES_RULE_MESSAGE =
  "The auction will be automatically closed when the end time comes. The highest bid will win the auction.";
export const START_PRICE_REQUIRED_MESSAGE = "Start price is required";
export const START_PRICE_FORMAT_MESSAGE =
  "Start proce can have up to two decimal places";
export const START_PRICE_MUST_BE_BIGGER_THAN_0_MESSAGE =
  "Start price must be bigger than 0.";
export const MAX_ALLOWED_START_PRICE =
  "Max allowed startPrice is $" + START_PRICE_MAXIMUM_VALUE;
export const PRODUCT_NAME_REQUIRED_MESSAGE = "Product name is required";
export const PRODUCT_NAME_FORMAT_MESSAGE = "60 characters is maximum";
export const CATEGORY_REQUIRED_MESSAGE = "Category is required";
export const SUBCATEGORY_REQUIRED_MESSAGE = "Subcategory is required";
export const DESCRIPTION_REQUIRED_MESSAGE = "Description is required";
export const DESCRIPTION_FORMAT_MESSAGE = "700 characters is maximum";
export const START_DATE_REQUIRED_MESSAGE = "Start date is required";
export const END_DATE_REQUIRED_MESSAGE = "End date is required";
export const START_DATE_MIN_VALUE_MESSAGE =
  "Start date can not be before today";
export const END_DATE_MIN_VALUE_MESSAGE =
  "End date must be later than start date";
export const PRODUCT_ACTIVE_VALUE_MESSAGE =
  "Your product can not be active more than 1 year";
export const START_DATE_MAX_VALUE_MESSAGE =
  "You can start your product auction maximum 1 year from now";
export const UPLOAD_PHOTOS_MESSAGE = "Upload Photos";
export const OR_DRAG_AND_DROP_MESSAGE = "or just drag and drop";
export const MIN_PHOTOS_NUMBER_MESSAGE =
  "+ Add at least " + MIN_PHOTOS + " photos";
export const MIN_PHOTOS_NUMER_ERR_MESSAGE =
  "Please add at least " + MIN_PHOTOS + " photos";
export const MAX_PHOTOS_NUMBER_MESSAGE =
  "You can add " + MAX_PHOTOS + " photos at most";
export const PRODUCT_DATA_SAVED_SUCCESSFULLY =
  "Product data saved successfully";
export const CHARACTERS_LEFT_MESSAGE = " characters left";
export const PRODUCT_NAME_MIN_WORDS_MESSAGE =
  "Product name need to have at least two words";
export const PRODUCT_NAME_MAX_WORDS_MESSAGE =
  "Product name can have maximum 5 words";
export const DESCRIPTION_MAX_WORDS_MESSAGE =
  "Description can have maximum 100 words ";
export const DID_YOU_MEAN_MESSAGE = "Did you mean?";
export const CARD_NAME_REQUIRED_MESSAGE = "Card name is required";
export const CARD_NUMBER_REQUIRED_MESSAGE = "Card number is required";
export const CARD_NUMBER_FORMAT_MESSAGE = "Please provide correct card number";
export const CARD_EXPIRATION_DATE_REQUIRED_MESSAGE =
  "Card expiration date is required";
export const CARD_EXPIRATION_DATE_FORMAT_MESSAGE =
  "Please provide correct expiry date";
export const CARD_CVC_REQUIRED_MESSAGE = "Cvc is required";
export const CARD_CVC_FORMAT_MESSAGE = "Please provide correct CVC number";
export const CARD_DATA_NOT_SAVED =
  "Your card information have not been stored successfully";

export const SUCCESSFUL_PAYMENT = "Successful payment";
export const FAILED_PAYMENT = "Payment could not be made";
export const PAYMENT_QUESTION =
  "Are you sure you want make payment for this product?";
export const PAYMENT_INFO_MESSAGE =
  "If you have already added your card data, that card is going to be used for this payment. ";
export const PAYMENT_NEW_CARD_QUESTION_MESSAGE =
  " Do you want to enter new card data";
