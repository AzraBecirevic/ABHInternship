package com.app.auctionbackend.dtos;

public class AddedBidDto {

    private Boolean bidAdded;
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getBidAdded() {
        return bidAdded;
    }

    public void setBidAdded(Boolean bidAdded) {
        this.bidAdded = bidAdded;
    }

}
