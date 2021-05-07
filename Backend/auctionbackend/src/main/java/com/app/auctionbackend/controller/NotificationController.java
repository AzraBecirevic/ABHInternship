package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.NotificationDto;
import com.app.auctionbackend.dtos.NotificationSeenDto;
import com.app.auctionbackend.dtos.NotificationTokenDto;
import com.app.auctionbackend.helper.Message;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.NotificationToken;
import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.NotificationService;
import com.app.auctionbackend.service.NotificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.app.auctionbackend.helper.ValidationMessageConstants.DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE;
import static com.app.auctionbackend.helper.ValidationMessageConstants.USER_DOES_NOT_EXIST;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    CustomerService customerService;

    @Autowired
    NotificationTokenService notificationTokenService;

    @Autowired
    NotificationService notificationService;

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

    @GetMapping(value = "/getUnread/{email}")
    public ResponseEntity getUnreadNotifications(@PathVariable String email){
        Customer customer = customerService.findByEmail(email);
        if(customer == null){
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
        if(!customer.getActive()){
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }

        List<NotificationDto> notificationDtos = notificationService.getUnreadNotifications(customer);
        return new ResponseEntity(notificationDtos, HttpStatus.OK);
    }

    @GetMapping("/clearAllNotifications/{email}")
    public ResponseEntity clearAllNotifications(@PathVariable String email){
        Customer customer = customerService.findByEmail(email);

        if(customer==null){
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.FORBIDDEN);
        }
        if(!customer.getActive()){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
        }

        notificationService.setAllCustomersNotificationToRead(customer);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping(value = "/clearSingleNotification")
    public ResponseEntity clearSingleNotification(@RequestBody NotificationSeenDto notificationSeenDto){
        Customer customer = customerService.findByEmail(notificationSeenDto.getEmail());

        if(customer==null){
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.FORBIDDEN);
        }
        if(!customer.getActive()){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
        }

        if(notificationSeenDto.getNotificationId() > 0){

        Boolean notificationRead = notificationService.setSingleCustomerNotificationToRead(customer, notificationSeenDto.getNotificationId());
        if(notificationRead)
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }
}
