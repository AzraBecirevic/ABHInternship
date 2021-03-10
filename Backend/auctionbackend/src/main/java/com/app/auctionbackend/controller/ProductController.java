package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.ProductsInfiniteDto;
import com.app.auctionbackend.dtos.ProductDetailsDto;
import com.app.auctionbackend.dtos.ProductDto;
import com.app.auctionbackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/getOffered")
    public List<ProductDto> getProducts(){
        List<ProductDto> productDtos = productService.getProducts();
        return productDtos;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProductDetailsDto> getProductById(@PathVariable Integer id){
        if(id<=0)
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        ProductDetailsDto productDetailsDto = productService.getProductById(id);
        return new ResponseEntity<ProductDetailsDto>(productDetailsDto, HttpStatus.OK);
    }

    @GetMapping(value = "/byCategory/{categoryId}/{number}")
    public ResponseEntity<ProductsInfiniteDto> getProductByCategoryId(@PathVariable Integer categoryId, @PathVariable Integer number){
        if(categoryId<=0){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        ProductsInfiniteDto productDtos = productService.getProductByCategoryId(categoryId, number);
        return new ResponseEntity<ProductsInfiniteDto>(productDtos, HttpStatus.OK);
    }

    @GetMapping(value = "/getMostExpensive")
    public ProductDetailsDto getMostExpensiveProduct(){
        ProductDetailsDto productDetailsDto = productService.getMostExpensiveProduct();
        return productDetailsDto;
    }

    @GetMapping(value = "/newArrivals/{number}")
    public ProductsInfiniteDto getNewArrivalsInfProduct(@PathVariable Integer number){
        ProductsInfiniteDto productDtos = productService.getNewArrivalsInfProduct(number);
        return productDtos;
    }

    @GetMapping(value = "/lastChance/{number}")
    public ProductsInfiniteDto getLastChanceInfProduct(@PathVariable Integer number){
        ProductsInfiniteDto productsInfiniteDto = productService.getLastChanceInfProduct(number);
        return productsInfiniteDto;
    }

    @GetMapping("byName/{productName}")
    public List<ProductDto> searchProductsByName(@PathVariable String productName){
        List<ProductDto> productDtos = productService.searchProductsByName(productName);
        return productDtos;
    }

}
