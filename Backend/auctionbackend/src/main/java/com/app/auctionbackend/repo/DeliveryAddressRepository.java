package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.DeliveryAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress,Integer> {
}
