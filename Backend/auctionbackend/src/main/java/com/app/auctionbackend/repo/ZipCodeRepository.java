package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.ZipCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZipCodeRepository extends JpaRepository<ZipCode, Integer> {
}
