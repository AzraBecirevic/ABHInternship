package com.app.auctionbackend;

import com.app.auctionbackend.config.SecretKeyHandler;
import com.app.auctionbackend.config.SecurityConstants;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

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
        mvc.perform(MockMvcRequestBuilders.get("/bid/byProductId/0")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void getBidsByProductById1ShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/bid/byProductId/1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void addBidShouldReturnIsOk() throws Exception{

        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token ="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjdXN0b21lcjFAbWFpbC5jb20iLCJleHAiOjE2MTU4NDM3Nzd9.f-WUq6Gs8xNa0obrHGkQaS-txCRm5Y-is-KI2helw2sXAImZ7rzpTYxkBJSSlVidy8a17F_IENB_Mq4JP35y4w";

      mvc.perform(MockMvcRequestBuilders.post("/bid/add")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"customerEmail\": \"customer1@mail.com\", \"productId\": \"1\", \"bidPrice\":\"120\"}")
        ).andExpect(status().isOk());

    }

    @Test
    public void addBidShouldReturnBadRequest() throws Exception{

        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token ="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjdXN0b21lcjFAbWFpbC5jb20iLCJleHAiOjE2MTU4NDM3Nzd9.f-WUq6Gs8xNa0obrHGkQaS-txCRm5Y-is-KI2helw2sXAImZ7rzpTYxkBJSSlVidy8a17F_IENB_Mq4JP35y4w";

        mvc.perform(MockMvcRequestBuilders.post("/bid/add")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"customerEmail\": \"customer1@mail.com\", \"productId\": \"0\", \"bidPrice\":\"120\"}")
        ).andExpect(status().isBadRequest());

    }

    @Test
    public void addBidShouldReturnIsForbidden() throws Exception{

        mvc.perform(MockMvcRequestBuilders.post("/bid/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"customerEmail\": \"customer1@mail.com\", \"productId\": \"1\", \"bidPrice\":\"120\"}")
        ).andExpect(status().isForbidden());

    }

}
