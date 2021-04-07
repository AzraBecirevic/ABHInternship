package com.app.auctionbackend.dtos;

import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.Image;
import com.app.auctionbackend.model.Subcategory;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AddProductDto {

    private String name;
    private double startPrice;
    private String startDate;
    private Integer startDateDay;
    private Integer startDateMonth;
    private Integer startDateYear;
    private String endDate;
    private Integer endDateDay;
    private Integer endDateMonth;
    private Integer endDateYear;
    private String description;
    private Integer subcategoryId;
    private String customerEmail;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public double getStartPrice() {
        return startPrice;
    }

    public void setStartPrice(double startPrice) {
        this.startPrice = startPrice;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public Integer getStartDateDay() {
        return startDateDay;
    }

    public void setStartDateDay(Integer startDateDay) {
        this.startDateDay = startDateDay;
    }

    public Integer getStartDateMonth() {
        return startDateMonth;
    }

    public void setStartDateMonth(Integer startDateMonth) {
        this.startDateMonth = startDateMonth;
    }

    public Integer getStartDateYear() {
        return startDateYear;
    }

    public void setStartDateYear(Integer startDateYear) {
        this.startDateYear = startDateYear;
    }

    public Integer getEndDateDay() {
        return endDateDay;
    }

    public void setEndDateDay(Integer endDateDay) {
        this.endDateDay = endDateDay;
    }

    public Integer getEndDateMonth() {
        return endDateMonth;
    }

    public void setEndDateMonth(Integer endDateMonth) {
        this.endDateMonth = endDateMonth;
    }

    public Integer getEndDateYear() {
        return endDateYear;
    }

    public void setEndDateYear(Integer endDateYear) {
        this.endDateYear = endDateYear;
    }

    public Integer getSubcategoryId() {
        return subcategoryId;
    }

    public void setSubcategoryId(Integer subcategoryId) {
        this.subcategoryId = subcategoryId;
    }

}
