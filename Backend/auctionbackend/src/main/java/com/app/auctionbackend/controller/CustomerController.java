package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CustomerChangePassDto;
import com.app.auctionbackend.dtos.CustomerDetailsDto;
import com.app.auctionbackend.dtos.DeliveryDataDto;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

import static com.app.auctionbackend.config.MessageConstants.EMAIL_MESSAGE;
import static com.app.auctionbackend.config.MessageConstants.EMAIL_SUBJECT;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    public class Message {
        public String text;

        public Message(String text) {
            this.text = text;
        }
    }

    @Autowired
    private CustomerService customerService;

    @Autowired
    private EmailService emailService;

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
        CustomerDetailsDto customerDetailsDto = customerService.getCustomerInfoData(email);
        if(customerDetailsDto == null)
            return new ResponseEntity<CustomerDetailsDto>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(customerDetailsDto, HttpStatus.OK);
    }

    @PostMapping(value = "/update/{email}")
    public ResponseEntity updateCustomer(@PathVariable String email, @RequestBody CustomerDetailsDto customerData){
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
        DeliveryDataDto deliveryDataDto = customerService.getCustomerDeliveryData(email);
        if(deliveryDataDto == null)
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);

        return new ResponseEntity<DeliveryDataDto>(deliveryDataDto, HttpStatus.OK);
    }



    @PostMapping(value = "/saveDeliveryData/{email}")
    public ResponseEntity saveCustomerDeliveryData(@PathVariable String email, @RequestBody DeliveryDataDto deliveryDataDto){
        try{
            DeliveryDataDto savedDeliveryData = customerService.saveCustomerDeliveryData(deliveryDataDto, email);
            if(savedDeliveryData != null){
                return new ResponseEntity(savedDeliveryData,HttpStatus.OK);
            }
        }
        catch (Exception ex){
            return  new ResponseEntity<>(new Message(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message("Delivery data can not be saved"), HttpStatus.BAD_REQUEST);
    }

}
