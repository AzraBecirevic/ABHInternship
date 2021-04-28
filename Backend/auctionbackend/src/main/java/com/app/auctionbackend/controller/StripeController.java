package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CustomerStripeDto;
import com.app.auctionbackend.dtos.PublicKeyDto;
import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.service.BidService;
import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.ProductService;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodListParams;
import com.stripe.param.SetupIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import static com.app.auctionbackend.helper.ValidationMessageConstants.*;


@RestController
@RequestMapping("/stripe")
public class StripeController {

    public class Message {
        public String text;

        public Message(String text) {
            this.text = text;
        }
    }

    private static Gson gson = new Gson();

    @Value("${stripe.secret.key}")
    public String stripeSecretKey;

    @Value("${stripe.redirect.url}")
    public String stripeRedirectUrl;

    public String stripePublicKey = "pk_test_51IbMXrAMYsRIxGUFSQehTyEOAgSNMFqLCvtXRVrDPGGgyRXKDoEDblXfQ7dUoNO1xoOTCgoTMTqCuhC4FRgLxczI00rD4fWKa3";

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;

    @Autowired
    private BidService bidService;

    @PostMapping("/create-setup-intent")
    public ResponseEntity createSetupIntent(@RequestBody CustomerStripeDto customerStripeDto){

        Stripe.apiKey = stripeSecretKey;

       com.app.auctionbackend.model.Customer appCustomer = customerService.findByEmail(customerStripeDto.getEmail());
       if(appCustomer == null)
           return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.BAD_REQUEST);

       if(!appCustomer.getActive()){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
       }

       try {
            CustomerCreateParams params = CustomerCreateParams.builder().build();

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

    private PaymentMethod getPaymentMethod(com.app.auctionbackend.model.Customer appCustomer){
        try{
            PaymentMethodListParams params = PaymentMethodListParams.builder()
                    .setCustomer(appCustomer.getStripeId())
                    .setType(PaymentMethodListParams.Type.CARD)
                    .build();

            PaymentMethodCollection paymentMethods = PaymentMethod.list(params);
            return paymentMethods.getData().get(0);

        }catch(Exception exception){
           return null;
        }
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity createPaymentIntent(@RequestBody CustomerStripeDto customerStripeDto){

        com.app.auctionbackend.model.Customer appCustomer = customerService.findByEmail(customerStripeDto.getEmail());
        if(appCustomer == null)
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.BAD_REQUEST);

        if(!appCustomer.getActive()){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
        }

        com.app.auctionbackend.model.Product appProduct = productService.findProductById(customerStripeDto.getProductId());
        if(appProduct == null)
            return new ResponseEntity(new Message(PRODUCT_DOES_NOT_EXIST_MESSAGE), HttpStatus.BAD_REQUEST);

        if(appProduct.getPaid()){
            return new ResponseEntity(new Message(PRODUCT_IS_ALREADY_SOLD_MESSAGE), HttpStatus.BAD_REQUEST);
        }

        Bid bid = bidService.getCustomerBidForProduct(appCustomer.getId(), appProduct.getId());
        if(bid == null)
            return new ResponseEntity(new Message(NO_BID_FOR_PRODUCT_AND_CUSTOMER_MESSAGE), HttpStatus.BAD_REQUEST);

        Stripe.apiKey = stripeSecretKey;

       PaymentMethod paymentMethod = getPaymentMethod(appCustomer);

       if(paymentMethod != null){
           Long amount = ((long) bid.getBidPrice())*100;
           PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                   .setCurrency("usd")
                   .setAmount(amount)
                   .setPaymentMethod(paymentMethod.getId())
                   .setCustomer(appCustomer.getStripeId())
                   .setConfirm(true)
                   .setOffSession(true)
                   .build();
           try {
               PaymentIntent paymentIntent = PaymentIntent.create(params);
               productService.savePaidProduct(appProduct.getId());
               return new ResponseEntity(gson.toJson(paymentIntent), HttpStatus.OK);

           } catch (StripeException err) {
               String paymentIntentId = err.getStripeError().getPaymentIntent().getId();
               try{
                   PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

                   return new ResponseEntity(gson.toJson(paymentIntent), HttpStatus.OK);
               }
               catch (StripeException exception){
                   return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
               }
           }
       }
        return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity createCheckoutSession(@RequestBody CustomerStripeDto customerStripeDto){
        com.app.auctionbackend.model.Customer appCustomer = customerService.findByEmail(customerStripeDto.getEmail());
        if(appCustomer == null)
            return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.BAD_REQUEST);

        if(!appCustomer.getActive()){
            return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
        }

        com.app.auctionbackend.model.Product appProduct = productService.findProductById(customerStripeDto.getProductId());
        if(appProduct == null)
            return new ResponseEntity(new Message(PRODUCT_DOES_NOT_EXIST_MESSAGE), HttpStatus.BAD_REQUEST);

        if(appProduct.getPaid()){
            return new ResponseEntity(new Message(PRODUCT_IS_ALREADY_SOLD_MESSAGE), HttpStatus.BAD_REQUEST);
        }

        Bid bid = bidService.getCustomerBidForProduct(appCustomer.getId(), appProduct.getId());
        if(bid == null)
            return new ResponseEntity(new Message(NO_BID_FOR_PRODUCT_AND_CUSTOMER_MESSAGE), HttpStatus.BAD_REQUEST);

        Stripe.apiKey = stripeSecretKey;

        try {
            Long amount = ((long) bid.getBidPrice())*100;
            final String REDIRECT_URL = stripeRedirectUrl;
            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(REDIRECT_URL + "?success=true")
                    .setCancelUrl(REDIRECT_URL + "?canceled=true")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount(amount)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(appProduct.getName())
                                                                    .build())
                                                    .build())
                                    .build())
                    .build();

            Session session = Session.create(params);
            HashMap<String, String> responseData = new HashMap<String, String>();
            responseData.put("id", session.getId());
            return new ResponseEntity(gson.toJson(responseData), HttpStatus.OK);
        }
        catch (Exception ex){
            System.out.println(ex.getMessage());
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
