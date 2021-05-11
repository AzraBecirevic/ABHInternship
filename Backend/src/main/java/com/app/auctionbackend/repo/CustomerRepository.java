package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Integer> {
    public Customer findByEmail(String email);
}
