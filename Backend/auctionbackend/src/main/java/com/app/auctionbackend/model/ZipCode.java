package com.app.auctionbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ZipCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String zipCode;
    @OneToMany(mappedBy = "zipCode", fetch = FetchType.LAZY)
    private List<DeliveryAddress> deliveryAddresses = new ArrayList<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public List<DeliveryAddress> getDeliveryAddresses() {
        return deliveryAddresses;
    }

    public void setDeliveryAddresses(List<DeliveryAddress> deliveryAddresses) {
        this.deliveryAddresses = deliveryAddresses;
    }
}
