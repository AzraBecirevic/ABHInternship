package com.app.auctionbackend.model;

import com.sun.istack.Nullable;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private LocalDateTime dateOfBirth;
    private String phoneNumber;
    private Boolean active;
    @Column(name = "ProfileImage", length = 10485760)
    private String profileImage;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Bid> bids = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "gender_id", nullable = true)
    private Gender gender;

    @OneToOne(mappedBy = "customer")
    private DeliveryAddress deliveryAddress;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Notification> notifications = new ArrayList<>();

    private String stripeId;

    @OneToOne(mappedBy = "customer")
    private NotificationToken notificationToken;

    @OneToOne(mappedBy = "customer")
    private SocialMediaAuthData socialMediaAuthData;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Bid> getBids() {
        return bids;
    }

    public void setBids(List<Bid> bids) {
        this.bids = bids;
    }

    public LocalDateTime getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDateTime dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public DeliveryAddress getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(DeliveryAddress deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public String getStripeId() {
        return stripeId;
    }

    public void setStripeId(String stripeId) {
        this.stripeId = stripeId;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public NotificationToken getNotificationToken() {
        return notificationToken;
    }

    public void setNotificationToken(NotificationToken notificationToken) {
        this.notificationToken = notificationToken;
    }

    public SocialMediaAuthData getSocialMediaAuthData() {
        return socialMediaAuthData;
    }

    public void setSocialMediaAuthData(SocialMediaAuthData socialMediaAuthData) {
        this.socialMediaAuthData = socialMediaAuthData;
    }
}
