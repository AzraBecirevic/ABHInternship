package com.app.auctionbackend.dtos;

import java.util.ArrayList;
import java.util.List;

public class CategoryDto {

    private Integer id;
    private String name;
    private List<SubcategoryDto> subcategoryList = new ArrayList<>();

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

    public List<SubcategoryDto> getSubcategoryList() {
        return subcategoryList;
    }

    public void setSubcategoryList(List<SubcategoryDto> subcategoryList) {
        this.subcategoryList = subcategoryList;
    }

}
