package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CustomerDto;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.service.CustomerService;
import io.swagger.models.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

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


    @PostMapping(consumes = "application/json")
    public ResponseEntity addCustomer(@RequestBody Customer customer){
        try {
            Customer registeredCustomer = customerService.registrateCustomer(customer);
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

   /* @GetMapping()
    public ResponseEntity getCustomers(){
            List<CustomerDto> customers = customerService.getCustomers();
            return ResponseEntity.ok(customers);
    }*/

}
