package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.CustomerDto;
import com.app.auctionbackend.helper.Helper;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.repo.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("customerService")
public class CustomerService {

    @Autowired
    private  CustomerRepository customerRepository;

    final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public Customer registrateCustomer(Customer customer) throws Exception{

        List<Customer> customers = customerRepository.findAll();
        for (Customer c:customers) {
            if(c.getUsername().equals(customer.getUsername()))
                throw  new Exception("Enter different mail");
        }

        if(customer.getFirstName()==null || customer.getFirstName().isEmpty())
            throw new Exception("First name is required");

        if(customer.getLastName()==null || customer.getLastName().isEmpty())
            throw new Exception("Last name is required");

        if(customer.getUsername() == null || customer.getUsername().isEmpty())
            throw  new Exception("Email is required");

        if(!Helper.isEmailFormatValid(customer.getUsername()))
            throw  new Exception("Email format is not valid, email format should be like: example@example.com");

        if(customer.getPassword()==null || customer.getPassword().isEmpty())
            throw new Exception("Password is required");

        if(!Helper.isPasswordFormatValid(customer.getPassword()))
            throw new Exception("Password format is not valid");

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));

        customerRepository.save(customer);

        return customer;

    }

    public Customer findByUsername(String username){
        List<Customer> customers = customerRepository.findAll();
        Customer customer=null;
        for (Customer c:customers) {
            if(username.equals(c.getUsername())) {
                customer=c;
            }
        }

        if(customer!=null)
            return customer;
        return null;
    }

}
