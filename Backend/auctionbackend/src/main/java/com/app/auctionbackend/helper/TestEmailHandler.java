package com.app.auctionbackend.helper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TestEmailHandler {

    @Value("${test.email}")
    public String testEmail;

    @Value("${test.nonexistent.email}")
    public String testNonExistentEmail;

}
