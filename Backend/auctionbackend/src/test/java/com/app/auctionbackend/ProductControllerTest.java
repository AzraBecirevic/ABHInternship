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

import static com.app.auctionbackend.TestEndpointConstants.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ApplicationContext context;

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
    public void getFilteredProductSortingAddedShouldOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(GET_FILTERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryIds\": [\"1\"], \"productName\": \"\", \"fetchNumber\":\"1\"}, \"sortType\": \"ADDED\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void getFilteredProductSortingTimeLeftShouldOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(GET_FILTERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryIds\": [\"1\"], \"productName\": \"\", \"fetchNumber\":\"1\"}, \"sortType\": \"TIME_LEFT\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void getFilteredProductSortingPriceLowHighShouldOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(GET_FILTERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryIds\": [\"1\"], \"productName\": \"\", \"fetchNumber\":\"1\"}, \"sortType\": \"PRICE_LOW_TO_HIGH\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void getFilteredProductSortingPriceHighLowShouldOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(GET_FILTERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryIds\": [\"1\"], \"productName\": \"\", \"fetchNumber\":\"1\"}, \"sortType\": \"PRICE_HIGH_TO_LOW\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void getFilteredProductSortingDefaultShouldOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.post(GET_FILTERED_PRODUCTS_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryIds\": [\"1\"], \"productName\": \"\", \"fetchNumber\":\"1\"}, \"sortType\": \"\"}")
        ).andExpect(status().isOk());
    }

    @Test
    public void getPriceFilterValuesShouldReturnOk() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get(GET_PRICE_FILTER_VALUES_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void addProductShouldReturnCreated() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");
        String email = testEmailHandler.testEmail;

        mvc.perform(MockMvcRequestBuilders.post(ADD_PRODUCT_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"name\": \"Shoes\", \"startPrice\": \"20\", \"startDateDay\":\"19\", \"startDateMonth\": \"4\", \"startDateYear\":\"2021\", \"endDateDay\":\"30\", \"endDateMonth\":\"4\" , \"endDateYear\":\"2021\", \"description\":\"women shoes\" , \"subcategoryId\":\"2\", \"customerEmail\":\""+email+"\"}")
        ).andExpect(status().isCreated());
    }

    @Test
    public void addProductShouldReturnBadRequest() throws Exception{
        SecretKeyHandler skh = (SecretKeyHandler) context.getBean("secretKeyHandler");
        SecurityConstants.SECRET = skh.tokenKey;

        String token = skh.jwtToken;

        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");
        String email = testEmailHandler.testEmail;

        mvc.perform(MockMvcRequestBuilders.post(ADD_PRODUCT_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content("{\"name\": \"Shoes\", \"startPrice\": \"20\", \"startDateDay\":\"19\", \"startDateMonth\": \"20\", \"startDateYear\":\"2021\", \"endDateDay\":\"30\", \"endDateMonth\":\"4\" , \"endDateYear\":\"2021\", \"description\":\"women shoes\" , \"subcategoryId\":\"2\", \"customerEmail\":\""+email+"\"}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void getRecommendedProductsReturnOk() throws Exception{
        TestEmailHandler testEmailHandler = (TestEmailHandler) context.getBean("testEmailHandler");
        String email = testEmailHandler.testEmail;

        mvc.perform(MockMvcRequestBuilders.get(GET_RECOMMENDED_PRODUCTS_ENDPOINT + email)
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }
}
