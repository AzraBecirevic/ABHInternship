package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CustomerChangePassDto;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

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
            if(registeredCustomer!=null){

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
        if(customer==null){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        try {
            String subject = "Forgot password";
            String link ="http://localhost:3000/changePassword";
            String message = "You can change your password here: "+ link;
            emailService.sendSimpleMessage(email,  subject, message);
        }
        catch(Error err){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/changePassword")
    public ResponseEntity changePassword(@RequestBody CustomerChangePassDto customerChangePassDto){
        Boolean passwordChanged= customerService.changePassword(customerChangePassDto);

        if(passwordChanged){
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

}
