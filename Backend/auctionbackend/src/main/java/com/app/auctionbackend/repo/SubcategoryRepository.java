package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Integer> {
}
