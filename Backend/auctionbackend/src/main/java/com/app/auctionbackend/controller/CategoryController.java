package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.CategoryDto;
import com.app.auctionbackend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping()
    public List<CategoryDto> getAllCategories(){
        List<CategoryDto> categories = categoryService.getAllCategories();
        return categories;
    }

}
