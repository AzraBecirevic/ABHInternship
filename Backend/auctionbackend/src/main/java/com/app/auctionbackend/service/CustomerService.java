package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.CustomerChangePassDto;
import com.app.auctionbackend.dtos.CustomerDetailsDto;
import com.app.auctionbackend.helper.Helper;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.repo.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.app.auctionbackend.helper.ValidationMessageConstants.*;


@Service("customerService")
public class CustomerService {

    @Autowired
    private  CustomerRepository customerRepository;

    final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private void checkIfUserAlreadyExist(String username)throws Exception{
        List<Customer> customers = customerRepository.findAll();
        for (Customer c : customers) {
            if (c.getEmail().equals(username))
                throw  new Exception(EMAIL_ALREADY_EXISTS_MESSAGE);
        }
    }

    private  void validateRequiredField(String field, String errorMessage) throws Exception{
        if(field == null || field.isEmpty())
            throw new Exception(errorMessage);
    }

    private void validateEmailFormat(String email) throws Exception{
        if(!Helper.isEmailFormatValid(email))
            throw  new Exception(EMAIL_FORMAT_MESSAGE);
    }

    private void validatePasswordFormat(String password) throws Exception{
        if(!Helper.isPasswordFormatValid(password))
            throw new Exception(PASSWORD_FORMAT_MESSAGE);
    }


    public Customer registerCustomer(Customer customer) throws Exception{

        checkIfUserAlreadyExist(customer.getEmail());

        validateRequiredField(customer.getFirstName(), FIRST_NAME_REQUIRED_MESSAGE);

        validateRequiredField(customer.getLastName(), LAST_NAME_REQUIRED_MESSAGE);

        validateRequiredField(customer.getEmail(), EMAIL_REQUIRED_MESSAGE);

        validateEmailFormat(customer.getEmail());

        validateRequiredField(customer.getPassword(), PASSWORD_REQUIRED_MESSAGE);

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

        if(customer != null)
            return customer;
        return null;
    }

    public boolean changePassword(CustomerChangePassDto customerChangePassDto){
        if(customerChangePassDto == null)
            return false;

        String email = customerChangePassDto.getEmail();
        if(email == null || email.isEmpty())
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

    public CustomerDetailsDto getCustomerInfoData(String email){

        Customer customer = findByEmail(email);

        if(customer == null)
            return null;

        ModelMapper modelMapper = new ModelMapper();

        CustomerDetailsDto customerDetailsDto = modelMapper.map(customer, CustomerDetailsDto.class);

        return customerDetailsDto;

    }
}
