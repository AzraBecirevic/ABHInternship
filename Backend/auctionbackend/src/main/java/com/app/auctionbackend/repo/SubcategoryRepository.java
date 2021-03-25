package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Integer> {
    List<Subcategory> findByCategoryId(Integer categoryId);
}
