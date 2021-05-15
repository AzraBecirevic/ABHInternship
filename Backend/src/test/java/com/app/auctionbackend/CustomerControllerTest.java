package com.app.auctionbackend;

import com.app.auctionbackend.config.SecretKeyHandler;
import com.app.auctionbackend.config.SecurityConstants;
import com.app.auctionbackend.helper.TestEmailHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.app.auctionbackend.TestEndpointConstants.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CustomerControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ApplicationContext context;


    @Test
    public void registerCustomerShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(REGISTER_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void registerCustomerIncorrectEmailShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(REGISTER_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail\", \"password\":\"mojpass123@\"}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void registerCustomerTooShortPasswordShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(REGISTER_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"s12@\"}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void registerCustomerPasswordWithoutSpecialCharacterShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(REGISTER_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"mojpass123\"}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void forgotPasswordShouldReturnBadRequest() throws Exception{
        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");
        String email = testEmailHandler.testNonExistentEmail;

        mvc.perform(MockMvcRequestBuilders.get( FORGOT_PASSWORD_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void forgotPasswordShouldReturnOk() throws Exception{
        AuctionbackendApplication.main(new String[]{});

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");
        String email = testEmailHandler.testEmail;

        mvc.perform(MockMvcRequestBuilders.get(FORGOT_PASSWORD_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getCustomerInfoDataShouldReturnOk() throws Exception{

        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");

        String email = testEmailHandler.testEmail;

        mvc.perform(MockMvcRequestBuilders.get(GET_CUSTOMER_INFO_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
        ).andExpect(status().isOk());
    }

    @Test
    public void getCustomerInfoDataShouldReturnBadRequest() throws Exception{

        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");

        String email = testEmailHandler.testNonExistentEmail;

        mvc.perform(MockMvcRequestBuilders.get(GET_CUSTOMER_INFO_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void updateCustomerShouldReturnBadRequest() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");

        String email = testEmailHandler.testEmail;


        mvc.perform(MockMvcRequestBuilders.post(UPDATE_CUSTOMER_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"firstName\": \"Name\", \"lastName\": \"Lastname\", \"genderId\": \"0\", \"phoneNumber\": \"111 222 333\", \"email\":\""+ email +"\", \"birthDay\":\"1\", \"birthMonth\":\"1\", \"birthYear\":\"2000\", \"imgFile\":\"null\"}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void updateCustomerShouldReturnOk() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");

        String email = testEmailHandler.testEmail;


        mvc.perform(MockMvcRequestBuilders.post(UPDATE_CUSTOMER_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"firstName\": \"Name\", \"lastName\": \"Lastname\", \"genderId\": \"2\", \"phoneNumber\": \"111 222 333\", \"email\":\""+ email +"\", \"birthDay\":\"1\", \"birthMonth\":\"1\", \"birthYear\":\"2000\", \"imgFile\":\"null\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void saveCustomerDeliveryDataShouldReturnOK() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");

        String email = testEmailHandler.testEmail;


        mvc.perform(MockMvcRequestBuilders.post(SAVE_DELIVERY_DATA_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"street\": \"Street 1\", \"zipCode\": \"12345\", \"city\": \"Sarajevo\", \"region\": \"Federacija Bosne i Hercegovine\", \"country\":\"Bosnia and Herzegovina\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void saveCustomerDeliveryDataShouldReturnBadRequest() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");

        String email = testEmailHandler.testEmail;


        mvc.perform(MockMvcRequestBuilders.post(SAVE_DELIVERY_DATA_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"street\": \"Street 1\", \"zipCode\": \"12345678901122345567899765\", \"city\": \"Sarajevo\", \"region\": \"Federacija Bosne i Hercegovine\", \"country\":\"Bosnia and Herzegovina\"}")
        ).andExpect(status().isBadRequest());
    }
}


