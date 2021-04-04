package com.app.auctionbackend.config;

public class MessageConstants {

    public static final String EMAIL_SUBJECT = "Forgot password";
    public static final String EMAIL_ENDPOINT = "http://localhost:3000/changePassword"; //"https://auction-frontend.herokuapp.com/changePassword";
    public static final String EMAIL_MESSAGE = "You can change your password here: " + EMAIL_ENDPOINT;

}
