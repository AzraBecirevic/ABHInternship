package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CustomerDto;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

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
            return new ResponseEntity<String>(ex.getMessage(),HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<String>("Something went wrong", HttpStatus.BAD_REQUEST);
    }

    @GetMapping()
    public ResponseEntity getCustomers(){
            List<CustomerDto> customers = customerService.getCustomers();
            return ResponseEntity.ok(customers);
    }

}
