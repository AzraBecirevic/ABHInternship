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
public class ProductControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void getProductsShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/getOffered")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductById1ShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductById0ShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/0")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void getProductByCategoryId1ShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/byCategory/1/1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductByCategoryId0ShouldReturnBadRequest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/byCategory/0/1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void getNewArrivalsShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/newArrivals/1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getLastChanceShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/lastChance/1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getMostExpensiveReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/getMostExpensive")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductsByNameReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/byName/black")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getProductsByNameReturnForbidden() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/product/byName/")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isForbidden());
    }

}
