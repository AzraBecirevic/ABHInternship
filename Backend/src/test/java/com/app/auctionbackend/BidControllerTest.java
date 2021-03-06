package com.app.auctionbackend;

import com.app.auctionbackend.config.SecretKeyHandler;
import com.app.auctionbackend.config.SecurityConstants;
import com.app.auctionbackend.helper.TestEmailHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.app.auctionbackend.TestEndpointConstants.ADD_BID_ENDPOINT;
import static com.app.auctionbackend.TestEndpointConstants.GET_BIDS_BY_PRODUCT_ID_ENDPOINT;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BidControllerTest {

    @Autowired
    private ApplicationContext context;

    private boolean isApplicationStarted=false;


    @Autowired
    private MockMvc mvc;


    @Test
    public void getBidsByProductById0ShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_BIDS_BY_PRODUCT_ID_ENDPOINT + "0")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void getBidsByProductById1ShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_BIDS_BY_PRODUCT_ID_ENDPOINT + "1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void addBidShouldReturnIsOk() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");

        String email = testEmailHandler.testEmail;

         mvc.perform(MockMvcRequestBuilders.post(ADD_BID_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"customerEmail\": \""+ email+ "\", \"productId\": \"1\", \"bidPrice\":\"120\"}")
         ).andExpect(status().isOk());
    }

    @Test
    public void addBidShouldReturnBadRequest() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;
        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");
        String email = testEmailHandler.testEmail;

        mvc.perform(MockMvcRequestBuilders.post(ADD_BID_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"customerEmail\": \"" + email + "\", \"productId\": \"0\", \"bidPrice\":\"120\"}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void addBidShouldReturnIsForbidden() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(ADD_BID_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"customerEmail\": \"customer1@mail.com\", \"productId\": \"1\", \"bidPrice\":\"120\"}")
        ).andExpect(status().isForbidden());
    }

}
