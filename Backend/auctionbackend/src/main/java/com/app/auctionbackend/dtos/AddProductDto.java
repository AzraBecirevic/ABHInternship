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
    private LocalDateTime startDate;
    private Integer startDateDay;
    private Integer startDateMonth;
    private Integer startDateYear;

    private LocalDateTime endDate;
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

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}
