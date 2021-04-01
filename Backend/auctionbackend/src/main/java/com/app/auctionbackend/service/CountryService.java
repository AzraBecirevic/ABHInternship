package com.app.auctionbackend.service;

import com.app.auctionbackend.model.Country;
import com.app.auctionbackend.repo.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("countryService")
public class CountryService {

    @Autowired
    private CountryRepository countryRepository;

    Country saveCountry(String countryName){
        List<Country> countryList = countryRepository.findAll();

        for (Country c:countryList) {
            if(c.getName().toLowerCase().equals(countryName.toLowerCase())){
                return c;
            }
        }
        Country country = new Country();
        country.setName(countryName);
        countryRepository.save(country);
        return country;
    }
}
