package com.app.auctionbackend.helper;

import static com.app.auctionbackend.helper.ValidationConstants.BID_MAX_PRICE;

public class ValidationMessageConstants {
    public static final String EMAIL_ALREADY_EXISTS_MESSAGE = "Email you entered already exists";
    public static final String EMAIL_REQUIRED_MESSAGE = "Email is required";
    public static final String EMAIL_FORMAT_MESSAGE = "Expected email format: example@example.com";
    public static final String PASSWORD_REQUIRED_MESSAGE = "Password is required";
    public static final String PASSWORD_FORMAT_MESSAGE = "Password format is not valid";
    public static final String FIRST_NAME_REQUIRED_MESSAGE = "First name is required";
    public static final String LAST_NAME_REQUIRED_MESSAGE = "Last name is required";
    public static final String BID_MAX_ALLOWED_PRICE_MESSAGE = "Maximum allowed bid is $" + BID_MAX_PRICE;
    public static final String BID_MUST_BE_BIGGER_THAN_HIGHEST_MESSAGE = "There are higher bids than yours. You could give a second try.";
    public static final String BID_IS_ALREADY_HIGHEST_MESSAGE = "Your bid is already highest bid.";
    public static final String BID_PLACED_SUCCESSFULLY_MESSAGE =  "Congrats! You are the highest bidder!";
    public static final String USER_DOES_NOT_EXIST = "There are no user associated with this account";
    public static final String GENDER_DOES_NOT_EXIST = "Specified gender does not exist";
    public static final String USER_MIN_AGE_MESSAGE = "You must be older than 18";
    public static final String DATE_OF_BIRTH_REQUIRED_MESSAGE = "Date of birth is required";
    public static final String PHONE_NUMBER_REQUIRED_MESSAGE = "Phone number is required";
    public static final String BID_NOT_THERE_CUSTOMER_NOT_ALLOWED_MESSAGE = "You are not allowed to bid product or there is no specified product.";
    public static final String COUNTRY_REQUIRED_MESSAGE = "Country is required";
    public static final String REGION_REQUIRED_MESSAGE = "State is required";
    public static final String CITY_REQUIRED_MESSAGE = "City is required";
    public static final String ZIP_CODE_REQUIRED_MESSAGE = "Zip code is required";
    public static final String STREET_REQUIRED_MESSAGE = "Street is required";
    public static final String ZIP_CODE_FORMAT_MESSAGE = "Expected zip code format: 11111 or 11111-1111";
    public static final String STREET_FORMAT_MESSAGE = "Characters, numbers, dots and commas allowed, 60 characters is maximum";
    public static final String PRODUCT_NAME_REQUIRED_MESSAGE = "Product name is required";
    public static final String DESCRIPTION_REQUIRED_MESSAGE = "Product description is required";
    public static final String START_PRICE_BIGGER_THAN_0_MESSAGE = "You need to enter start price bigger than zero";
    public static final String DESCRIPTION_FORMAT_MESSAGE = "Product description can have 700 character maximum";
    public static final String SUBCATEGORY_REQUIRED_MESSAGE = "Subcategory is required";
    public static final String SUBCATEGORY_DOES_NOT_EXIST_MESSAGE = "Specified subcategory does not exist";
    public static final String START_DATE_REQUIRED_MESSAGE = "Start date is required";
    public static final String START_DATE_MIN_VALUE_MESSAGE = "Start date can not be before today";
    public static final String START_DATE_MAX_VALUE_MESSAGE =  "You can start your product auction maximum 1 year from now";
    public static final String END_DATE_REQUIRED_MESSAGE = "End date is required";
    public static final String END_DATE_MIN_VALUE_MESSAGE = "End date must be later than start date";
    public static final String PRODUCT_ACTIVE_VALUE_MESSAGE = "Your product can not be active more than 1 year";
    public static final String CUSTOMER_CAN_NOT_BID_PRODUCT = "You can not bid your own product.";
}
