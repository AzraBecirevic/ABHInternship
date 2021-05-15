package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Product;

import java.util.List;

public interface ProductRepositoryCustom {
    public List<Product> getProductsByCategoryId(Integer categoryId);
}
