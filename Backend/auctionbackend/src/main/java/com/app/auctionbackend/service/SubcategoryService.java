package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.ProductDto;
import com.app.auctionbackend.dtos.SubcategoryDto;
import com.app.auctionbackend.model.Subcategory;
import com.app.auctionbackend.repo.SubcategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("subcategoryService")
public class SubcategoryService {

    @Autowired
    SubcategoryRepository subcategoryRepository;

    @Autowired
    ProductService productService;

    public List<SubcategoryDto> getSubcategoriesByCategoryId(Integer categoryId){
         List<Subcategory> subcategories = subcategoryRepository.findByCategoryId(categoryId);
         if(subcategories == null)
             return null;

         ModelMapper modelMapper = new ModelMapper();
         List<SubcategoryDto> subcategoryDtos = new ArrayList<>();

        for (Subcategory subcategory:subcategories) {
            SubcategoryDto subcategoryDto = modelMapper.map(subcategory, SubcategoryDto.class);
            List<ProductDto> productDtos = productService.getProductsBySubcategoryId(subcategory.getId());
            subcategoryDto.setNumberOfProducts(productDtos.size());
            subcategoryDtos.add(subcategoryDto);
        }

        return subcategoryDtos;
    }
    public Subcategory findById(Integer id){
        Subcategory subcategory = subcategoryRepository.findById(id).orElse(null);
        return subcategory;
    }
}
