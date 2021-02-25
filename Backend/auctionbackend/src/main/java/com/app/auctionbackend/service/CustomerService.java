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

    private void checkIfUserAlreadyExist(String username)throws Exception{
        List<Customer> customers = customerRepository.findAll();
        for (Customer c:customers) {
            if (c.getEmail().equals(username))
                throw  new Exception("Email you entered already exists");
        }
    }

    private  void validateRequiredField(String field, String errorMessage) throws Exception{
        if(field==null || field.isEmpty())
            throw new Exception(errorMessage);
    }

    private void validateEmailFormat(String email) throws Exception{
        if(!Helper.isEmailFormatValid(email))
            throw  new Exception("Expected email format: example@example.com");
    }

    private void validatePasswordFormat(String password) throws Exception{
        if(!Helper.isPasswordFormatValid(password))
            throw new Exception("Password format is not valid");
    }


    public Customer registerCustomer(Customer customer) throws Exception{

        checkIfUserAlreadyExist(customer.getEmail());

        validateRequiredField(customer.getFirstName(), "First name is required");

        validateRequiredField(customer.getLastName(), "Last name is required");

        validateRequiredField(customer.getEmail(), "Email is required");

        validateEmailFormat(customer.getEmail());

        validateRequiredField(customer.getPassword(),"Password is required");

        validatePasswordFormat(customer.getPassword());

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));

        customerRepository.save(customer);

        return customer;

    }

    public Customer findByEmail(String email){
        List<Customer> customers = customerRepository.findAll();
        Customer customer=null;
        for (Customer c:customers) {
            if(email.equals(c.getEmail())) {
                customer=c;
            }
        }

        if(customer!=null)
            return customer;
        return null;
    }

}
