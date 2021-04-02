package com.app.auctionbackend.service;

import com.app.auctionbackend.model.City;
import com.app.auctionbackend.model.Country;
import com.app.auctionbackend.model.State;
import com.app.auctionbackend.repo.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("cityService")
public class CityService {

    @Autowired
    private CityRepository cityRepository;

    City saveCity(String cityName, State state){
        List<City> cityList = cityRepository.findAll();

        for (City c : cityList) {
            if(c.getName().toLowerCase().equals(cityName.toLowerCase()) && c.getState().getId()==state.getId()){
                return c;
            }
        }
        City city = new City();
        city.setName(cityName);
        city.setState(state);
        cityRepository.save(city);
        return city;
    }
}
