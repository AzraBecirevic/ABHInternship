package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.ProductDetailsDto;
import com.app.auctionbackend.dtos.ProductDto;
import com.app.auctionbackend.model.Image;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.model.Subcategory;
import com.app.auctionbackend.repo.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static com.app.auctionbackend.helper.InfinityScrollConstants.NUMBER_PER_CALL;

@Service("productService")
public class ProductService {

    @Autowired
    ProductRepository productRepository;


    public List<ProductDto> getProducts(){

        List<Product> products = productRepository.findAll();

        if(products==null)
            return null;

        List<ProductDto> currentOfferedProducts = changeToDto(products);
        return currentOfferedProducts;
    }

    public ProductDetailsDto getProductById(Integer id){

        Product product = productRepository.findById(id).orElse(null);

        if(product!=null){
            ModelMapper modelMapper = new ModelMapper();
            ProductDetailsDto productDetailsDto = modelMapper.map(product, ProductDetailsDto.class);

            return productDetailsDto;
        }
        return null;
    }

    public List<ProductDto> getProductByCategoryId(Integer categoryId){
        List<Product> products = productRepository.findAll();

        List<Product> productsByCategoryId = new ArrayList<>();

        for (Product product: products) {
            boolean addToList = false;
            List<Subcategory> subcategories = product.getSubcategories();
            for (Subcategory s:subcategories) {
                if(s.getCategory().getId()==categoryId){
                    addToList=true;
                }
            }
            if(addToList)
                productsByCategoryId.add(product);
        }

        List<ProductDto> productDtos = changeToDto(productsByCategoryId);
        return productDtos;
    }

    public List<ProductDto> getNewArrivals(){
        List<Product> products = productRepository.findAll();
        List<Product> newArrivals = new ArrayList<>();

        for (Product p: products) {
            LocalDateTime now = LocalDateTime.now();
            long diff = ChronoUnit.DAYS.between(p.getStartDate(),now);
            if(diff<=3){
                newArrivals.add(p);
            }
        }

        if(newArrivals == null)
            return null;

        List<ProductDto> productDtos = changeToDto(newArrivals);
        return productDtos;
    }



    public List<ProductDto> getLastChanceProducts(){
        List<Product> products = productRepository.findAll();
        List<Product> lastChance = new ArrayList<>();

        for (Product p: products) {
            LocalDateTime now = LocalDateTime.now();
            long diff = ChronoUnit.DAYS.between(now,p.getEndDate());
            if(diff<=3){
                lastChance.add(p);
            }
        }

        if(lastChance == null)
            return null;

        List<ProductDto> productDtos = changeToDto(lastChance);
        return productDtos;
    }

    public  List<ProductDto> getNewArrivalsInfProduct(Integer number){
        List<ProductDto> newArrivals = getNewArrivals();

        if(newArrivals == null || newArrivals.size() == 0)
            return null;

        Integer from = (number * NUMBER_PER_CALL) - NUMBER_PER_CALL;
        Integer to = (number * NUMBER_PER_CALL);

        if(number * NUMBER_PER_CALL > newArrivals.size())
            to = newArrivals.size();

        List<ProductDto> newArrivalsInf = new ArrayList<>();

        for(int i = from; i < to; i++){
            newArrivalsInf.add(newArrivals.get(i));
        }

        return newArrivalsInf;
    }

    public  List<ProductDto> getLastChanceInfProduct(Integer number){
        List<ProductDto> lastChance = getLastChanceProducts();

        if(lastChance == null || lastChance.size() == 0)
            return null;

        Integer from = (number * NUMBER_PER_CALL) - NUMBER_PER_CALL;
        Integer to = (number * NUMBER_PER_CALL);

        if(number * NUMBER_PER_CALL > lastChance.size())
            to = lastChance.size();

        List<ProductDto> lastChanceInf = new ArrayList<>();

        for(int i = from; i < to; i++){
            lastChanceInf.add(lastChance.get(i));
        }
        return lastChanceInf;
    }

    public ProductDetailsDto getMostExpensiveProduct(){
        List<Product> products = productRepository.findByOrderByStartPrice();
        if(products==null || products.size()==0)
            return null;
        Product product = products.get(products.size()-1);

        if(product!=null){
            ModelMapper modelMapper = new ModelMapper();
            ProductDetailsDto productDetailsDto = modelMapper.map(product, ProductDetailsDto.class);

            return productDetailsDto;
        }
        return null;
    }

    private List<ProductDto> changeToDto(List<Product>products){
        List<ProductDto> productDtos = new ArrayList<>();

        for (Product p:products) {
            if (p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now())) {
                ProductDto productDto = new ProductDto();
                productDto.setId(p.getId());
                productDto.setName(p.getName());
                productDto.setStartPrice(p.getStartPrice());
                Image image = (p.getImageList() != null && !p.getImageList().isEmpty()) ? p.getImageList().get(0) : null;
                if (image != null)
                    productDto.setImage(image.getImage());

                productDtos.add(productDto);
            }
        }
        return productDtos;
    }

}
