package com.app.auctionbackend.dtos;

import java.util.ArrayList;
import java.util.List;

public class ProductDetailsDto {

    private Integer id;
    private String name;
    private double startPrice;
    private String description;
    private List<ImageDto> imageList = new ArrayList<>();

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

}
