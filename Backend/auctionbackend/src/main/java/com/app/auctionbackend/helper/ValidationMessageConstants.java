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
    public static final String BID_NOT_THERE_CUSTOMER_NOT_ALLOWED_MESSAGE = "You are not allowed to bid product or there is no specified product.";
}
