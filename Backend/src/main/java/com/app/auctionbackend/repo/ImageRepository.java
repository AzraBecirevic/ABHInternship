package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Integer> {
}
