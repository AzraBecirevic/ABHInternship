package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.CategoryDto;
import com.app.auctionbackend.model.Category;
import com.app.auctionbackend.repo.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("categoryService")
public class CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories(){
        List<Category> categories = categoryRepository.findAll();

        List<CategoryDto> categoryDtos = new ArrayList<>();
        ModelMapper modelMapper = new ModelMapper();
        for (Category c : categories) {
            CategoryDto categoryDto = modelMapper.map(c, CategoryDto.class);
            categoryDtos.add(categoryDto);
        }
        return categoryDtos;
    }

    public Category getCategoryByName(String name){
        List<Category> categories = categoryRepository.findAll();
        for (Category c : categories) {
            if(c.getName().toLowerCase().equals(name.toLowerCase()))
                return c;
        }
        return null;
    }

}
