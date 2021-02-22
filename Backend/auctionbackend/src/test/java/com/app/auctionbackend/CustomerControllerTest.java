package com.app.auctionbackend;

import com.app.auctionbackend.controller.CustomerController;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.service.CustomerService;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.Assert;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ContextConfiguration(classes = CustomerController.class)
@AutoConfigureMockMvc(addFilters = false)
//@AutoConfigureMockMvc
//@RunWith(SpringRunner.class)   //? 31, 32
//@WebMvcTest(CustomerController.class)
public class CustomerControllerTest {

 /*  @InjectMocks
    CustomerController customerController;

    @Mock
    CustomerService customerService;

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();*/


    // ?
   /* @Autowired
    private WebApplicationContext webApplicationContext

    @Before()
    public void setup()
    {
        //Init MockMvc Object and build
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }*/
    //?


    @Autowired
    MockMvc mockMvc;

    @MockBean
    private CustomerService customerService;

    @Test
    public void getcustomersShouldReturn200()throws Exception{
        RequestBuilder request = MockMvcRequestBuilders
                .get("/customer")
                .accept(MediaType.APPLICATION_JSON);


        MvcResult result = mockMvc.perform(request)
                .andExpect(status().isOk()).andReturn();
    }

    @Test
    public void customerControllerShouldReturnStatus201() throws Exception{
       /* Customer customer = new Customer();
        customer.setFirstName("cust1");
        customer.setLastName("custLast");
        customer.setEmail("cust1@mail.com");
        customer.setPassword(passwordEncoder.encode("pass1"));
        ResponseEntity responseEntity = customerController.addCustomer(customer);

        /*assertThat*
        Assert.isTrue(responseEntity.getStatusCode()== "200");*/


        RequestBuilder request = MockMvcRequestBuilders
                .post("/customer")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"pass1\"}");
               // .contentType(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(request)
                .andExpect(status().isCreated()).andReturn();
                //.andExpect(header().string("location", containsString("/item/")))
              //  .andReturn();


      /*  this.mockMvc.perform(MockMvcRequestBuilders.post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\": \"Cust1\", \"lastName\": \"Cust1Lats\", \"email\":\"cust1@mail.com\", \"password\":\"pass1\"}")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated())
                .andReturn();*/
    }
}
