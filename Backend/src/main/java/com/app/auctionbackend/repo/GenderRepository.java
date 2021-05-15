package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenderRepository extends JpaRepository<Gender, Integer> {
}
