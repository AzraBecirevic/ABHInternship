package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.SubcategoryDto;
import com.app.auctionbackend.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/subcategory")
public class SubcategoryController {

    @Autowired
    SubcategoryService subcategoryService;

    @GetMapping(value ="/byCategory/{categoryId}")
    public List<SubcategoryDto> getAllCategories(@PathVariable Integer categoryId){
        List<SubcategoryDto> subcategories = subcategoryService.getSubcategoriesByCategoryId(categoryId);
        return subcategories;
    }
}

