package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.CustomerChangePassDto;
import com.app.auctionbackend.helper.Helper;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
        Customer customer = null;
        for (Customer c:customers) {
            if(email.equals(c.getEmail())) {
                customer = c;
            }
        }

        if(customer!=null)
            return customer;
        return null;
    }

    public boolean changePassword(CustomerChangePassDto customerChangePassDto){
        if( customerChangePassDto==null)
            return false;

        String email = customerChangePassDto.getEmail();
        if(email==null || email.isEmpty())
            return false;

        String password = customerChangePassDto.getPassword();
        if(password == null || password.isEmpty() || !Helper.isPasswordFormatValid(password))
            return false;

        Customer customer = findByEmail(customerChangePassDto.getEmail());
        if(customer == null){
            return  false;
        }

        customer.setPassword(passwordEncoder.encode(password));
        customerRepository.save(customer);

        return true;
    }
}
