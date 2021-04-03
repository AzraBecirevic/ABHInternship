package com.app.auctionbackend.dtos;

public class SellProductDto {

    private Integer id;
    private String name;
    private String image;
    private String startPrice;
    private long timeLeft;
    private String numberOfBids;
    private String highestBid;
    private double highestBidValue;
    private Boolean isBidHighest = false;
    private String customerBidPrice;
    private Boolean isCustomerPriceHighestBid = false;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getStartPrice() {
        return startPrice;
    }

    public void setStartPrice(String startPrice) {
        this.startPrice = startPrice;
    }

    public void setHighestBid(String highestBid) {
        this.highestBid = highestBid;
    }

    public String getHighestBid() {
        return highestBid;
    }

    public long getTimeLeft() {
        return timeLeft;
    }

    public void setTimeLeft(long timeLeft) {
        this.timeLeft = timeLeft;
    }

    public void setNumberOfBids(String numberOfBids) {
        this.numberOfBids = numberOfBids;
    }

    public String getNumberOfBids() {
        return numberOfBids;
    }

    public Boolean getBidHighest() {
        return isBidHighest;
    }

    public void setBidHighest(Boolean bidHighest) {
        isBidHighest = bidHighest;
    }

    public double getHighestBidValue() {
        return highestBidValue;
    }

    public void setHighestBidValue(double highestBidValue) {
        this.highestBidValue = highestBidValue;
    }

    public void setCustomerBidPrice(String customerBidPrice) {
        this.customerBidPrice = customerBidPrice;
    }

    public String getCustomerBidPrice() {
        return customerBidPrice;
    }

    public Boolean getCustomerPriceHighestBid() {
        return isCustomerPriceHighestBid;
    }

    public void setCustomerPriceHighestBid(Boolean customerPriceHighestBid) {
        isCustomerPriceHighestBid = customerPriceHighestBid;
    }

}

