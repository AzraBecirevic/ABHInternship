package com.app.auctionbackend.dtos;

public class PriceFilterDto {

    private double minPrice;
    private double maxPrice;
    private double averagePrice;
    private String minPriceText;
    private String maxPriceText;
    private String averagePriceText;

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

    public double getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(double averagePrice) {
        this.averagePrice = averagePrice;
    }

    public String getMaxPriceText() {
        return maxPriceText;
    }

    public void setMaxPriceText(String maxPriceText) {
        this.maxPriceText = maxPriceText;
    }

    public String getAveragePriceText() {
        return averagePriceText;
    }

    public void setAveragePriceText(String averagePriceText) {
        this.averagePriceText = averagePriceText;
    }

    public String getMinPriceText() {
        return minPriceText;
    }

    public void setMinPriceText(String minPriceText) {
        this.minPriceText = minPriceText;
    }

}

