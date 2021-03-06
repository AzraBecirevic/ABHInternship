package com.app.auctionbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SecretKeyHandler {

    @Value("${secret.key}")
    public String tokenKey;

    @Value("${jwt.token}")
    public String jwtToken;

}
