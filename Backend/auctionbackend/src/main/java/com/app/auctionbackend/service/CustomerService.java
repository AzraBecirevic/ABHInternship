package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.CustomerChangePassDto;
import com.app.auctionbackend.dtos.CustomerDetailsDto;
import com.app.auctionbackend.dtos.DeliveryDataDto;
import com.app.auctionbackend.helper.Helper;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.Gender;
import com.app.auctionbackend.repo.CustomerRepository;
import com.app.auctionbackend.repo.GenderRepository;
import org.apache.commons.io.FileUtils;
import org.apache.tomcat.jni.Local;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import static com.app.auctionbackend.helper.ValidationConstants.USER_MIN_AGE;
import static com.app.auctionbackend.helper.ValidationMessageConstants.*;


@Service("customerService")
public class CustomerService {

    @Autowired
    private  CustomerRepository customerRepository;

    @Autowired
    private GenderRepository genderRepository;

    final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private void checkIfUserAlreadyExist(String username)throws Exception{
        List<Customer> customers = customerRepository.findAll();
        for (Customer c : customers) {
            if (c.getEmail().equals(username))
                throw new Exception(EMAIL_ALREADY_EXISTS_MESSAGE);
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

    private void validatePhoneNumberFormat(String phoneNumber) throws Exception{
        if(!Helper.isPhoneNumberFormatValid(phoneNumber))
            throw  new Exception(PHONE_NUMBER_FORMAT_MESSAGE);
    }

    private void validatePasswordFormat(String password) throws Exception{
        if(!Helper.isPasswordFormatValid(password))
            throw new Exception(PASSWORD_FORMAT_MESSAGE);
    }

    private void validateGender(Integer genderId) throws Exception{
        if(genderId <= 0 || genderRepository.findById(genderId) == null)
            throw new Exception(GENDER_DOES_NOT_EXIST);
    }

    private void validateDateOfBirth(LocalDateTime dateOfBirth) throws Exception{
        if(dateOfBirth == null)
            throw new Exception(DATE_OF_BIRTH_REQUIRED_MESSAGE);
        if(dateOfBirth.getYear() + USER_MIN_AGE > LocalDateTime.now().getYear())
            throw new Exception(USER_MIN_AGE_MESSAGE);
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

        CustomerDetailsDto customerDetailsDto = new CustomerDetailsDto();
        customerDetailsDto.setBirthDay(customer.getDateOfBirth().getDayOfMonth());
        customerDetailsDto.setBirthMonth(customer.getDateOfBirth().getMonthValue());
        customerDetailsDto.setBirthYear(customer.getDateOfBirth().getYear());
        customerDetailsDto.setDateOfBirth(customer.getDateOfBirth());
        customerDetailsDto.setEmail(customer.getEmail());
        customerDetailsDto.setFirstName(customer.getFirstName());
        customerDetailsDto.setGenderId(customer.getGender().getId());
        customerDetailsDto.setLastName(customer.getLastName());
        customerDetailsDto.setPhoneNumber(customer.getPhoneNumber());
        customerDetailsDto.setProfileImage(customer.getProfileImage());

        return customerDetailsDto;
    }

    private void checkIfUserExist(String email)throws Exception{
        Customer customer = customerRepository.findByEmail(email);
        if(customer == null)
            throw new Exception(USER_DOES_NOT_EXIST);
    }

    public CustomerDetailsDto updateCustomer(String email,CustomerDetailsDto customerData) throws Exception{
        checkIfUserExist(email);

        validateRequiredField(customerData.getFirstName(), FIRST_NAME_REQUIRED_MESSAGE);

        validateRequiredField(customerData.getLastName(), LAST_NAME_REQUIRED_MESSAGE);

        validateRequiredField(customerData.getEmail(), EMAIL_REQUIRED_MESSAGE);

        validateEmailFormat(customerData.getEmail());

        validateGender(customerData.getGenderId());

        validateDateOfBirth(LocalDateTime.of(customerData.getBirthYear(), customerData.getBirthMonth(), customerData.getBirthDay(),0,0));

        validateRequiredField(customerData.getPhoneNumber(), PHONE_NUMBER_REQUIRED_MESSAGE);
        validatePhoneNumberFormat(customerData.getPhoneNumber());

        Customer customer = findByEmail(email);

        if(!customer.getEmail().equals(customerData.getEmail())){
            checkIfUserAlreadyExist(customerData.getEmail());
        }

        Gender gender = genderRepository.findById(customerData.getGenderId()).orElse(null);

        LocalDateTime birth_date = LocalDateTime.of(customerData.getBirthYear(), customerData.getBirthMonth(), customerData.getBirthDay(),0,0);

        customer.setGender(gender);
        customer.setDateOfBirth(birth_date);
        customer.setPhoneNumber(customerData.getPhoneNumber());
        customer.setEmail(customerData.getEmail());
        customer.setLastName(customerData.getLastName());
        customer.setFirstName(customerData.getFirstName());

        customerRepository.save(customer);

        return getCustomerInfoData(customer.getEmail());
    }

    public CustomerDetailsDto updateCustomerPhoto(String email, MultipartFile photo){
        Customer customer = customerRepository.findByEmail(email);
        if(customer == null)
            return null;

        try{
            byte[] fileContent = photo.getBytes();
            String encodedString = Base64.getEncoder().encodeToString(fileContent);

            customer.setProfileImage(encodedString);
        }
        catch (Exception exception){}

        customerRepository.save(customer);

        return getCustomerInfoData(customer.getEmail());
    }

   /*public DeliveryDataDto saveCustomerDeliveryData(DeliveryDataDto deliveryDataDto, String email){
        Customer customer = findByEmail(email);

        if(customer == null || deliveryDataDto==null)
            return null;
    }*/

    public DeliveryDataDto getCustomerDeliveryData(String email){
        Customer customer = findByEmail(email);

        if(customer == null)
            return null;

        DeliveryDataDto deliveryDataDto = new DeliveryDataDto();

        if(customer.getDeliveryAddress() != null){
            try {
                deliveryDataDto.setStreet(customer.getDeliveryAddress().getStreet());
                deliveryDataDto.setZipCode(customer.getDeliveryAddress().getZipCode().getZipCode());
                deliveryDataDto.setCity(customer.getDeliveryAddress().getCity().getName());
                deliveryDataDto.setRegion(customer.getDeliveryAddress().getCity().getState().getName());
                deliveryDataDto.setCountry(customer.getDeliveryAddress().getCity().getState().getCountry().getName());
            }
           catch (Exception ex){
                return null;
           }
            return deliveryDataDto;
        }
       return null;
    }
}
