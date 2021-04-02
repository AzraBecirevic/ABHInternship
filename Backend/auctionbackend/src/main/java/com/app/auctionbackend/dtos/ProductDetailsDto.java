package com.app.auctionbackend.dtos;

import java.util.ArrayList;
import java.util.List;

public class ProductDetailsDto {

    private Integer id;
    private String name;
    private double startPrice;
    private String description;
    private double highestBid;
    private Integer numberOfBids=0;
    private long timeLeft=0;
    private List<ImageDto> imageList = new ArrayList<>();
    private String startPriceText;
    private String highestBidText;
    private Boolean activeProduct = true;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getStartPrice() {
        return startPrice;
    }

    public void setStartPrice(double startPrice) {
        this.startPrice = startPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ImageDto> getImageList() {
        return imageList;
    }

    public void setImageList(List<ImageDto> imageList) {
        this.imageList = imageList;
    }

    public double getHighestBid() {
        return highestBid;
    }

    public void setHighestBid(double highestBid) {
        this.highestBid = highestBid;
    }

    public Integer getNumberOfBids() {
        return numberOfBids;
    }

    public void setNumberOfBids(Integer numberOfBids) {
        this.numberOfBids = numberOfBids;
    }

    public long getTimeLeft() {
        return timeLeft;
    }

    public void setTimeLeft(long timeLeft) {
        this.timeLeft = timeLeft;
    }

    public String getStartPriceText() {
        return startPriceText;
    }

    public void setStartPriceText(String startPriceText) {
        this.startPriceText = startPriceText;
    }

    public String getHighestBidText() {
        return highestBidText;
    }

    public void setHighestBidText(String highestBidText) {
        this.highestBidText = highestBidText;
    }

    public Boolean getActiveProduct() {
        return activeProduct;
    }

    public void setActiveProduct(Boolean activeProduct) {
        this.activeProduct = activeProduct;
    }

}
