package com.app.auctionbackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

//import static com.app.auctionbackend.AuctionbackendApplication.tokenKey;


//@PropertySource("classpath:application.properties")
//@Service
public class SecurityConstants {


   // @Value("${secret.key}")
    public static String SECRET = "SecretKeyToGenJWTs";
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/customer";
    public  static final String EXPOSE_HEADERS = "Access-Control-Expose-Headers";
    public  static final String  EXPOSED_AUTH_HEADER="Authorization";
}
