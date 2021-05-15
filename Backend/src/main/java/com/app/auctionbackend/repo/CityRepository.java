package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City,Integer> {
}
