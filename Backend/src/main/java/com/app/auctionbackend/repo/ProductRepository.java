package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Integer>, ProductRepositoryCustom {
    List<Product> findByOrderByStartPrice();
    List<Product> findByCustomerId(Integer id);
}
