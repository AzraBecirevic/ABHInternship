package com.app.auctionbackend.config;

public class EndpointConstants {

    public static final String FORGET_PASSWORD_URL = "/customer/forgotPassword/{email}";
    public static final String CHANGE_PASSWORD_URL = "/customer/changePassword";
    public static final String CATEGORY_URL =  "/category";
    public static final String GET_OFFERED_PRODUCTS_URL = "/product/getOffered";
    public static final String GET_PRODUCT_BY_ID_URL = "/product/{id}";
    public static final String GET_PRODUCT_BY_CATEGORY_ID_URL = "/product/byCategory/{categoryId}/{number}";
    public static final String GET_NEW_ARRIVALS_URL = "/product/newArrivals/{number}";
    public static final String GET_LAST_CHANCE_URL = "/product/lastChance/{number}";
    public static final String GET_SWAGGER_URL = "/swagger-ui.html";
    public static final String GET_MOST_EXPENSIVE_PRODUCT_URL = "product/getMostExpensive";
    public static final String GET_BIDS_BY_PRODUCT_ID_URL = "/bid/byProductId/{productId}";
    public static final String GET_PRODUCT_BY_NAME_URL = "/product/byName/{productName}";
    public static final String GET_SUBCATEGORIES_BY_CATEGORY_ID = "/subcategory/byCategory/{categoryId}";
    public static final String GET_FILTERED_PRODUCTS = "/filtered";
    public static final String GET_PRICE_FILTER_VALUES = "/getPriceFilterValues";
    public static final String CHECK_IS_ACCOUNT_ACTIVE_ENDPOINT = "/customer/checkIsAccountActive/{email}";
    public static final String GET_RECOMMENDED_PRODUCTS = "/product/getRecommended/{email}";
    public static final String SAVE_NOTIFICATION_TOKEN = "/notification/save";
    public static final String GET_UNREAD_NOTIFICATIONS = "/notification/getUnread/{email}";

}
