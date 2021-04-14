package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CustomerStripeDto;
import com.app.auctionbackend.dtos.PublicKeyDto;
import com.app.auctionbackend.service.CustomerService;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.model.Customer;
import com.stripe.model.SetupIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SetupIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/stripe")
public class StripeController {

    private static Gson gson = new Gson();

    @Value("${stripe.secret.key}")
    public String stripeSecretKey;

    public String stripePublicKey = "pk_test_51IbMXrAMYsRIxGUFSQehTyEOAgSNMFqLCvtXRVrDPGGgyRXKDoEDblXfQ7dUoNO1xoOTCgoTMTqCuhC4FRgLxczI00rD4fWKa3";


    @Autowired
    private CustomerService customerService;

    @PostMapping("/create-setup-intent")
    public ResponseEntity createSetupIntent(@RequestBody CustomerStripeDto customerStripeDto){

        Stripe.apiKey = stripeSecretKey;

       com.app.auctionbackend.model.Customer appCustomer = customerService.findByEmail(customerStripeDto.getEmail());
       if(appCustomer == null)
           return new ResponseEntity(null, HttpStatus.BAD_REQUEST);

        try {
            CustomerCreateParams params =
                    CustomerCreateParams.builder()
                            .build();

            Customer customer = Customer.create(params);

            SetupIntentCreateParams setupIntentParams = new SetupIntentCreateParams.Builder()
                    .setCustomer(customer.getId())
                    .build();
            SetupIntent setupIntent = SetupIntent.create(setupIntentParams);

            customerService.saveCustomerStripeId(setupIntent.getCustomer(), appCustomer);

            return new ResponseEntity(gson.toJson(setupIntent), HttpStatus.OK);
        }
        catch (Exception ex){
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getPublicKey")
    public ResponseEntity getPublicKey(){
        PublicKeyDto publicKeyDto = new PublicKeyDto();
        publicKeyDto.setPublicKey(stripePublicKey);
        return new ResponseEntity(publicKeyDto, HttpStatus.OK);
    }
}
