package com.app.auctionbackend.dtos;

import java.io.File;
import java.time.LocalDateTime;

public class CustomerDetailsDto {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime dateOfBirth;
    private String phoneNumber;
    private String profileImage;
    private Integer genderId;
    private Integer birthDay;
    private Integer birthMonth;
    private Integer birthYear;
    private File imgFile;

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

    public LocalDateTime getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDateTime dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public Integer getGenderId() {
        return genderId;
    }

    public void setGenderId(Integer genderId) {
        this.genderId = genderId;
    }

    public Integer getBirthDay() {
        return birthDay;
    }

    public Integer getBirthMonth() {
        return birthMonth;
    }

    public Integer getBirthYear() {
        return birthYear;
    }

    public void setBirthDay(Integer birthDay) {
        this.birthDay = birthDay;
    }

    public void setBirthMonth(Integer birthMonth) {
        this.birthMonth = birthMonth;
    }

    public void setBirthYear(Integer birthYear) {
        this.birthYear = birthYear;
    }

    public File getImgFile() {
        return imgFile;
    }

    public void setImgFile(File imgFile) {
        this.imgFile = imgFile;
    }
}
