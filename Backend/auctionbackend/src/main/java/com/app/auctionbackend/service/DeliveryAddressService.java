package com.app.auctionbackend.service;

import com.app.auctionbackend.model.City;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.DeliveryAddress;
import com.app.auctionbackend.model.ZipCode;
import com.app.auctionbackend.repo.DeliveryAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service("deliveryAddressService")
public class DeliveryAddressService {

    @Autowired
    DeliveryAddressRepository deliveryAddressRepository;

    DeliveryAddress saveDeliveryAdress(String street, ZipCode zipCode, City city, Customer customer){

        if(customer.getDeliveryAddress() != null){
            DeliveryAddress deliveryAddress = customer.getDeliveryAddress();
            deliveryAddress.setStreet(street);
            deliveryAddress.setCity(city);
            deliveryAddress.setZipCode(zipCode);

            deliveryAddressRepository.save(deliveryAddress);
            return deliveryAddress;
        }

        DeliveryAddress deliveryAddress = new DeliveryAddress();
        deliveryAddress.setStreet(street);
        deliveryAddress.setCity(city);
        deliveryAddress.setZipCode(zipCode);
        deliveryAddress.setCustomer(customer);
        deliveryAddressRepository.save(deliveryAddress);
        return deliveryAddress;
    }

}
