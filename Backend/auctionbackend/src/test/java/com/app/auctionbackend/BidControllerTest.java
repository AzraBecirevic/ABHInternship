package com.app.auctionbackend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BidControllerTest {

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
    public void addBidShouldReturnIsForbidden() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post("/bid/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"customerEmail\": \"customer1@mail.com\", \"productId\": \"1\", \"bidPrice\":\"120\"}")
        ).andExpect(status().isForbidden());
    }

}
