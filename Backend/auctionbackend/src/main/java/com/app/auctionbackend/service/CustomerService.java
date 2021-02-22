package com.app.auctionbackend.service;

import com.app.auctionbackend.helper.Helper;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("customerService")
public class CustomerService {

    @Autowired
    private  CustomerRepository customerRepository;

    final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public List<Customer> getCustomers(){
        List<Customer> customers = customerRepository.findAll();
        return customers;
    }

    public Customer registrateCustomer(Customer customer) throws Exception{

        if(customer.getFirstName()==null || customer.getFirstName().isEmpty())
            throw new Exception("First name is required");

        if(customer.getLastName()==null || customer.getLastName().isEmpty())
            throw new Exception("Last name is required");

        if(customer.getEmail() == null || customer.getEmail().isEmpty())
            throw  new Exception("Email is required");

        if(!Helper.isEmailFormatValid(customer.getEmail()))
            throw  new Exception("Email format is not valid, email format should be like: example@example.com");

        if(customer.getPassword()==null || customer.getPassword().isEmpty())
            throw new Exception("Password is required");

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));

        customerRepository.save(customer);

        return customer;

    }

}
