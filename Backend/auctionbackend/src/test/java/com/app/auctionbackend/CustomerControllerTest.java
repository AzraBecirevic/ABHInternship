package com.app.auctionbackend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CustomerControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void registerCustomerShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                 )
                .andExpect(status().isBadRequest());
    }

    @Test
    public void registerCustomerShouldReturnIsCreated() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"mojpass123@\"}")
                 )
                .andExpect(status().isCreated());
    }

    @Test
    public void registerCustomerIncorrectEmailShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail\", \"password\":\"mojpass123@\"}")
        )
                .andExpect(status().isBadRequest());
    }

    @Test
    public void registerCustomerTooShortPasswordShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"s12@\"}")
        )
                .andExpect(status().isBadRequest());
    }

    @Test
    public void registerCustomerPasswordWithoutSpecialCharacterShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"mojpass123\"}")
        )
                .andExpect(status().isBadRequest());
    }

}


