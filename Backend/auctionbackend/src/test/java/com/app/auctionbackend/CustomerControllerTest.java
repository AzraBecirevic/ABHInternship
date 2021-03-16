package com.app.auctionbackend;

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

import static com.app.auctionbackend.TestEndpointConstants.FORGOT_PASSWORD_ENDPOINT;
import static com.app.auctionbackend.TestEndpointConstants.REGISTER_ENDPOINT;
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
    public void registerCustomerShouldReturnIsCreated() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(REGISTER_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"mojpass123@\"}")
        ).andExpect(status().isCreated());
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
}


