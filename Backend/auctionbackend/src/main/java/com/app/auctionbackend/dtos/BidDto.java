package com.app.auctionbackend.dtos;

import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.Product;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.swing.text.StyledEditorKit;
import java.time.LocalDateTime;

public class BidDto {

    private Integer id;
    private LocalDateTime dateOfBidPlacement;
    private double bidPrice;
    private Integer customerId;
    private String customerFullName;
    private Integer productId;
    private Boolean isHighestBid = false;
    private String bidPriceText;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public LocalDateTime getDateOfBidPlacement() {
        return dateOfBidPlacement;
    }

    public void setDateOfBidPlacement(LocalDateTime dateOfBidPlacement) {
        this.dateOfBidPlacement = dateOfBidPlacement;
    }

    public double getBidPrice() {
        return bidPrice;
    }

    public void setBidPrice(double bidPrice) {
        this.bidPrice = bidPrice;
    }

    public Boolean getHighestBid() {
        return isHighestBid;
    }

    public void setHighestBid(Boolean highestBid) {
        isHighestBid = highestBid;
    }

    public String getBidPriceText() {
        return bidPriceText;
    }

    public void setBidPriceText(String bidPriceText) {
        this.bidPriceText = bidPriceText;
    }
}


