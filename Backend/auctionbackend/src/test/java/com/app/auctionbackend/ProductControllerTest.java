package com.app.auctionbackend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.app.auctionbackend.TestEndpointConstants.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void getProductsShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_OFFERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductById1ShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_PRODUCT_BY_ID_ENDPOINT + "1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductById0ShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_PRODUCT_BY_ID_ENDPOINT + "0")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isNotFound());
    }

    @Test
    public void getNewArrivalsShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_NEW_ARRIVALS_ENDPOINT + "1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getLastChanceShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_LAST_CHANCE_ENDPOINT + "1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getMostExpensiveReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_MOST_EXPENSIVE_PRODUCT_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductsByNameReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_PRODUCT_BY_NAME + "black")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductsByNameReturnForbidden() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_PRODUCT_BY_NAME)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isForbidden());
    }

    @Test
    public void getFilteredProductsShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(GET_FILTERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryIds\": [\"1\"], \"productName\": \"\", \"fetchNumber\":\"1\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void getFilteredProductsShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(GET_FILTERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void getPriceFilterValuesShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_PRICE_FILTER_VALUES_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }
}
