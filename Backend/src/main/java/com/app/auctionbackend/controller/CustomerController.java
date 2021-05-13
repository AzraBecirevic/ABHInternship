package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CustomerChangePassDto;
import com.app.auctionbackend.dtos.CustomerDetailsDto;
import com.app.auctionbackend.dtos.DeliveryDataDto;
import com.app.auctionbackend.dtos.SocialMediaAuthDto;
import com.app.auctionbackend.helper.Message;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.EmailService;
import com.app.auctionbackend.service.SocialMediaAuthDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

import static com.app.auctionbackend.config.MessageConstants.EMAIL_MESSAGE;
import static com.app.auctionbackend.config.MessageConstants.EMAIL_SUBJECT;
import static com.app.auctionbackend.helper.ValidationMessageConstants.*;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SocialMediaAuthDataService socialMediaAuthDataService;

    @PostMapping(consumes = "application/json")
    public ResponseEntity addCustomer(@RequestBody Customer customer){
        try {
            Customer registeredCustomer = customerService.registerCustomer(customer);
            if(registeredCustomer != null){

                URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(registeredCustomer.getId())
                        .toUri();

                return new ResponseEntity(location,HttpStatus.CREATED);
            }
        }
        catch (Exception ex){
            return  new ResponseEntity<>(new Message(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message("Something went wrong"), HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/addCustomerSocialMediaLogin")
    public ResponseEntity addCustomerViaSocialMediaLogin(@RequestBody SocialMediaAuthDto socialMediaAuthDto){
        try {
            Customer customer = customerService.findByEmail(socialMediaAuthDto.getEmail());
            if(customer != null){
               socialMediaAuthDataService.updateCustomerSocialMediaAuthData(socialMediaAuthDto, customer);
                return new ResponseEntity(HttpStatus.OK);
            }

            Customer registeredCustomer = customerService.registerCustomerViaSocialMedia(socialMediaAuthDto);
            if(registeredCustomer != null){
                socialMediaAuthDataService.setCustomerSocialMediaAuthData(socialMediaAuthDto, registeredCustomer);
                URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(registeredCustomer.getId())
                        .toUri();

                return new ResponseEntity(location,HttpStatus.CREATED);
            }
        }
        catch (Exception ex){
            return  new ResponseEntity<>(new Message(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message("Something went wrong"), HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/forgotPassword/{email}")
    public ResponseEntity forgotPassword(@PathVariable String email){
        Customer customer = customerService.findByEmail(email);
        if(customer == null){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        try {
            emailService.sendSimpleMessage(email, EMAIL_SUBJECT, EMAIL_MESSAGE);
        }
        catch(Error err){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/changePassword")
    public ResponseEntity changePassword(@RequestBody CustomerChangePassDto customerChangePassDto){
        Boolean passwordChanged = customerService.changePassword(customerChangePassDto);

        if(passwordChanged){
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/getInfoData/{email}")
    public ResponseEntity<CustomerDetailsDto> getCustomerInfoData(@PathVariable String email){
        if(customerService.findByEmail(email)==null){
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
        if(!customerService.checkIsAccountActive(email)){
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }

        CustomerDetailsDto customerDetailsDto = customerService.getCustomerInfoData(email);
        if(customerDetailsDto == null)
            return new ResponseEntity<CustomerDetailsDto>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(customerDetailsDto, HttpStatus.OK);
    }

    @PostMapping(value = "/update/{email}")
    public ResponseEntity updateCustomer(@PathVariable String email, @RequestBody CustomerDetailsDto customerData){
        if(customerService.findByEmail(email)==null){
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.FORBIDDEN);
        }

        if(!customerService.checkIsAccountActive(email)){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
        }

        try{
            CustomerDetailsDto updatedCustomer = customerService.updateCustomer(email, customerData);
            if(updatedCustomer != null){
                return new ResponseEntity(updatedCustomer,HttpStatus.OK);
            }
        }
        catch (Exception ex){
            return  new ResponseEntity<>(new Message(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message("Something went wrong"), HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/updatePhoto/{email}")
    public ResponseEntity updateCustomerPhoto(@PathVariable String email, @RequestParam MultipartFile imgFile){
        if(customerService.findByEmail(email)==null){
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.FORBIDDEN);
        }
        if(!customerService.checkIsAccountActive(email)){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
        }

        try{
            CustomerDetailsDto updatedCustomer = customerService.updateCustomerPhoto(email, imgFile);
            if(updatedCustomer != null){
                return new ResponseEntity(updatedCustomer,HttpStatus.OK);
            }
        }
        catch (Exception ex){
            return  new ResponseEntity<>(new Message(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message("Image can not be changed"), HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/getDeliveryData/{email}")
    public ResponseEntity<DeliveryDataDto> getCustomerDeliveryData(@PathVariable String email){

        if(customerService.findByEmail(email)==null){
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
        if(!customerService.checkIsAccountActive(email)){
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }

        DeliveryDataDto deliveryDataDto = customerService.getCustomerDeliveryData(email);
        if(deliveryDataDto == null)
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);

        return new ResponseEntity<DeliveryDataDto>(deliveryDataDto, HttpStatus.OK);
    }


    @PostMapping(value = "/saveDeliveryData/{email}")
    public ResponseEntity saveCustomerDeliveryData(@PathVariable String email, @RequestBody DeliveryDataDto deliveryDataDto){

        if(customerService.findByEmail(email)==null){
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.FORBIDDEN);
        }
        if(!customerService.checkIsAccountActive(email)){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
        }

        try{
            DeliveryDataDto savedDeliveryData = customerService.saveCustomerDeliveryData(deliveryDataDto, email);
            if(savedDeliveryData != null){
                return new ResponseEntity(savedDeliveryData,HttpStatus.OK);
            }
        }
        catch (Exception ex){
            return new ResponseEntity<>(new Message(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message("Delivery data can not be saved"), HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/hasSellingProducts/{email}")
    public ResponseEntity<Boolean> isCustomerSellingProducts(@PathVariable String email){

        Boolean sellingProducts = customerService.isCustomerSellingProducts(email);
        return new ResponseEntity<Boolean>(sellingProducts, HttpStatus.OK);
    }

    @GetMapping(value = "/deactivateAccount/{email}" )
    public ResponseEntity<Boolean> deactivateAccount(@PathVariable String email){

        if(customerService.findByEmail(email)==null){
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.FORBIDDEN);
        }
        if(!customerService.checkIsAccountActive(email)){
            return new ResponseEntity(new Message(ACCOUNT_HAS_ALREADY_BEEN_DEACTIVATED_MESSAGE), HttpStatus.FORBIDDEN);
        }

        if(customerService.hasBidProducts(email)){
            return new ResponseEntity(new Message(CAN_NOT_DEACTIVATE_HAS_BID_PRODUCTS_MESSAGE), HttpStatus.BAD_REQUEST);
        }

        if(customerService.hasProductsToPay(email)){
            return new ResponseEntity(new Message(CAN_NOT_DEACTIVATE_HAS_PRODUCTS_TO_PAY), HttpStatus.BAD_REQUEST);
        }

        Boolean accountDeactivated = customerService.deactivateAccount(email);
        return new ResponseEntity<Boolean>(accountDeactivated, HttpStatus.OK);
    }

    @GetMapping(value = "/checkIsAccountActive/{email}" )
    public ResponseEntity<Boolean> chekIsAccountActive(@PathVariable String email){

        Boolean accountActive = customerService.checkIsAccountActive(email);
        return new ResponseEntity<Boolean>(accountActive, HttpStatus.OK);
    }

    @GetMapping(value = "/checkIfCustomerHasCard/{email}" )
    public ResponseEntity<Boolean> checkIfCustomerHasCard(@PathVariable String email){

        Boolean hasCard = customerService.checkIfCustomerHasCard(email);
        return new ResponseEntity<Boolean>(hasCard, HttpStatus.OK);
    }
}
