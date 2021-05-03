package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.NotificationTokenDto;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.NotificationToken;
import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.NotificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    CustomerService customerService;

    @Autowired
    NotificationTokenService notificationTokenService;

    @PostMapping("/save")
    public ResponseEntity saveNotificationToken(@RequestBody NotificationTokenDto notificationTokenDto){
        Customer customer = customerService.findByEmail(notificationTokenDto.getCustomerEmail());
        if(customer != null && notificationTokenDto.getToken() != null && !notificationTokenDto.getToken().isEmpty()){
            NotificationToken notificationToken = notificationTokenService.saveToken(notificationTokenDto.getToken(), customer);
            NotificationTokenDto notificationTokenDto1 = new NotificationTokenDto();
            notificationTokenDto1.setCustomerEmail(customer.getEmail());
            notificationTokenDto1.setToken(notificationToken.getToken());

            return new ResponseEntity(notificationTokenDto1, HttpStatus.OK);
        }
        return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
    }
}
