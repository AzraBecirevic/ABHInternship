package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.*;
import com.app.auctionbackend.helper.Helper;
import com.app.auctionbackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    public class Message {
        public String text;

        public Message(String text) {
            this.text = text;
        }
    }

    @Autowired
    private ProductService productService;


    @GetMapping("/getOffered")
    public List<ProductDto> getProducts(){
        List<ProductDto> productDtos = productService.getProducts();
        return productDtos;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProductDetailsDto> getProductById(@PathVariable String id){
        if(!Helper.isIdValid(id)){
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

        Integer productId = 0;
        try{
            productId = Integer.parseInt(id);
        }catch (NumberFormatException ex){
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

        if(productId <= 0)
            return new ResponseEntity(HttpStatus.NOT_FOUND);

        ProductDetailsDto productDetailsDto = productService.getProductById(productId);
        if(productDetailsDto == null)
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        return new ResponseEntity<ProductDetailsDto>(productDetailsDto, HttpStatus.OK);
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

    @PostMapping("/filtered")
    public ResponseEntity<ProductsInfiniteDto> getFilteredProducts(@RequestBody FilterProductsDto filterProductsDto){
        if(filterProductsDto == null){
            return new ResponseEntity<ProductsInfiniteDto>(HttpStatus.BAD_REQUEST);
        }
        ProductsInfiniteDto productsInfiniteDto = productService.getFilteredProducts(filterProductsDto);
        return new ResponseEntity<ProductsInfiniteDto>(productsInfiniteDto, HttpStatus.OK);
    }

    @GetMapping("/getPriceFilterValues")
    public PriceFilterDto getPriceFilterValues(){
        PriceFilterDto priceFilterDto = productService.getPriceFilterValues();
        return priceFilterDto;
    }

    @GetMapping(value = "/getActiveProducts/{email}")
    public List<SellProductDto> getActiveProducts(@PathVariable String email){
        List<SellProductDto> sellProductDto = productService.getActiveProducts(email);
        return sellProductDto;
    }

    @GetMapping(value = "/getSoldProducts/{email}")
    public List<SellProductDto> getSoldProducts(@PathVariable String email){
        List<SellProductDto> sellProductDto = productService.getSoldProducts(email);
        return sellProductDto;
    }

    @GetMapping(value = "/getBidProducts/{email}")
    public List<SellProductDto> getBidProducts(@PathVariable String email){
        List<SellProductDto> sellProductDto = productService.getBidProducts(email);
        return sellProductDto;
    }

    @PostMapping("/addProduct")
    public ResponseEntity addProduct(@RequestBody AddProductDto addProductDto){
        try{
            Integer productId = productService.addProduct(addProductDto);
            return new ResponseEntity<>(productId, HttpStatus.CREATED);
        }
        catch (Exception ex){
            return new ResponseEntity<>(new Message(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/addProductPhotos/{id}")
    public ResponseEntity addProductPhotos(@PathVariable Integer id, @RequestParam MultipartFile[] imgFiles){
        var photoAdded = false;
        try{
            photoAdded = productService.addProductPhotos(id, imgFiles);
            return new ResponseEntity(photoAdded, HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity(photoAdded, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getRecommended/{email}")
    public List<ProductDto> getRecommendedProducts(@PathVariable String email){
       List<ProductDto> productDtos = productService.getRecommendedProducts(email);
       return productDtos;
    }

    @PostMapping("/saveSoldProduct")
    public ResponseEntity addProduct(@RequestBody SoldProductDto addProductDto){
        if(addProductDto.getProductId() <= 0)
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        productService.savePaidProduct(addProductDto.getProductId());
        return new ResponseEntity(HttpStatus.OK);
    }


}
