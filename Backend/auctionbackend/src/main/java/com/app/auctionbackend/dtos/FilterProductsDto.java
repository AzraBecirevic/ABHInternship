package com.app.auctionbackend.dtos;

import java.util.ArrayList;
import java.util.List;

public class FilterProductsDto {

    private List<Integer> categoryIds = new ArrayList<>();
    private List<Integer> subcategoryIds = new ArrayList<>();
    private String productName;
    private double minPrice = -1;
    private double maxPrice = -1;
    private Integer fetchNumber;

    public List<Integer> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Integer> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public List<Integer> getSubcategoryIds() {
        return subcategoryIds;
    }

    public void setSubcategoryIds(List<Integer> subcategoryIds) {
        this.subcategoryIds = subcategoryIds;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(double minPrice) {
        this.minPrice = minPrice;
    }

    public Integer getFetchNumber() {
        return fetchNumber;
    }

    public void setFetchNumber(Integer fetchNumber) {
        this.fetchNumber = fetchNumber;
    }

}
