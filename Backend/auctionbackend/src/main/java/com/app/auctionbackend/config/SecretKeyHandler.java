package com.app.auctionbackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class SecretKeyHandler {

    @Value("${secret.key}")
    public static String tokenKey;


    public void  printKey(){
        System.out.println("token key value: ");
        System.out.println(tokenKey);

    }
}
