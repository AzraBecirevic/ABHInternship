package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.SocialMediaAuthData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SocialMediaAuthDataRepository extends JpaRepository<SocialMediaAuthData, Integer> {
    List<SocialMediaAuthData> findByCustomerId(Integer customerId);
}
