package com.app.auctionbackend.config;

public class SecurityConstants {

    public static String SECRET;
    public static final long EXPIRATION_TIME_MILLISECONDS = 864_000_000;
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/customer";
    public static final String EXPOSE_HEADERS = "Access-Control-Expose-Headers";
    public static final String EXPOSED_AUTH_HEADER = "Authorization";

}
