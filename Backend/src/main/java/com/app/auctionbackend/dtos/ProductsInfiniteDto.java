package com.app.auctionbackend.dtos;

import java.util.ArrayList;
import java.util.List;

public class ProductsInfiniteDto {

    List<ProductDto> productsList = new ArrayList<>();
    Boolean hasMoreData = true;
    private String didYouMean;

    public String getDidYouMean() {
        return didYouMean;
    }

    public void setDidYouMean(String didYouMean) {
        this.didYouMean = didYouMean;
    }

    public Boolean getHasMoreData() {
        return hasMoreData;
    }

    public void setHasMoreData(Boolean hasMoreData) {
        this.hasMoreData = hasMoreData;
    }

    public List<ProductDto> getProductsList() {
        return productsList;
    }

    public void setProductsList(List<ProductDto> productsList) {
        this.productsList = productsList;
    }

}
