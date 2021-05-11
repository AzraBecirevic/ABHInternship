package com.app.auctionbackend.dtos;

import java.util.ArrayList;
import java.util.List;

public class DidYouMeanDto {
    private String didYouMeanString;
    private List<ProductDto> matchingProducts = new ArrayList<>();

    public String getDidYouMeanString() {
        return didYouMeanString;
    }

    public void setDidYouMeanString(String didYouMeanString) {
        this.didYouMeanString = didYouMeanString;
    }

    public List<ProductDto> getMatchingProducts() {
        return matchingProducts;
    }

    public void setMatchingProducts(List<ProductDto> matchingProducts) {
        this.matchingProducts = matchingProducts;
    }
}
