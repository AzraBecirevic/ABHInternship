package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.ProductsInfiniteDto;
import com.app.auctionbackend.dtos.ProductDetailsDto;
import com.app.auctionbackend.dtos.ProductDto;
import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.model.Image;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.model.Subcategory;
import com.app.auctionbackend.repo.BidRepository;
import com.app.auctionbackend.repo.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static com.app.auctionbackend.helper.InfinityScrollConstants.NUMBER_PER_CALL;

@Service("productService")
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    BidRepository bidRepository;

    DecimalFormat df = new DecimalFormat("#0.00");

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

            List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(id);
            if(bidList == null || bidList.size() == 0){
                productDetailsDto.setHighestBid(0);
                productDetailsDto.setNumberOfBids(0);
            }
            else{
                Bid highestBid = bidList.get(bidList.size()-1);
                productDetailsDto.setHighestBid(highestBid.getBidPrice());
                productDetailsDto.setNumberOfBids(bidList.size());
            }

            productDetailsDto.setStartPriceText(df.format(productDetailsDto.getStartPrice()));

            productDetailsDto.setHighestBidText(df.format(productDetailsDto.getHighestBid()));

            long diff = ChronoUnit.DAYS.between(product.getStartDate(),product.getEndDate());
            productDetailsDto.setTimeLeft(diff);

            return productDetailsDto;
        }
        return null;
    }

    public ProductsInfiniteDto getProductByCategoryId(Integer categoryId, Integer number){
        List<Product> products = productRepository.findAll();

        List<Product> productsByCategoryId = new ArrayList<>();

        ProductsInfiniteDto productsInfiniteDto = new ProductsInfiniteDto();

        for (Product product: products) {
            boolean addToList = false;
            List<Subcategory> subcategories = product.getSubcategories();
            for (Subcategory s:subcategories) {
                if(s.getCategory().getId() == categoryId){
                    addToList = true;
                }
            }
            if(addToList)
                productsByCategoryId.add(product);
        }

        List<ProductDto> productDtos = new ArrayList<>();
        if( productsByCategoryId.size() == 0){
            productsInfiniteDto.setHasMoreData(false);
            return productsInfiniteDto;
        }

        Integer from = (number * 9) - 9;
        Integer to = (number * 9);

        if(from>productsByCategoryId.size()-1){
            productsInfiniteDto.setHasMoreData(false);
            return productsInfiniteDto;
        }

        if(number * 9 >= productsByCategoryId.size()){
            to = productsByCategoryId.size();
            productsInfiniteDto.setHasMoreData(false);
        }

        List<Product> productsByCategoryInf = new ArrayList<>();

        for(int i = from; i < to; i++){
            productsByCategoryInf.add(productsByCategoryId.get(i));
        }

        productDtos = changeToDto(productsByCategoryInf);

        productsInfiniteDto.setProductsList(productDtos);
        return productsInfiniteDto;
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

        List<ProductDto> productDtos = changeToDto(lastChance);
        return productDtos;
    }

     public ProductsInfiniteDto getNewArrivalsInfProduct(Integer number){
        ProductsInfiniteDto productsInfiniteDto = new ProductsInfiniteDto();

        List<ProductDto> newArrivals = getNewArrivals();

        if(newArrivals == null || newArrivals.size() == 0){
           productsInfiniteDto.setHasMoreData(false);
           return productsInfiniteDto;
        }

        Integer from = (number * NUMBER_PER_CALL) - NUMBER_PER_CALL;
        Integer to = (number * NUMBER_PER_CALL);

        if(from > newArrivals.size()-1){
            productsInfiniteDto.setHasMoreData(false);
            return productsInfiniteDto;
        }

        if(number * NUMBER_PER_CALL >= newArrivals.size()){
            to = newArrivals.size();
            productsInfiniteDto.setHasMoreData(false);
        }

        List<ProductDto> newArrivalsInf = new ArrayList<>();

        for(int i = from; i < to; i++){
            newArrivalsInf.add(newArrivals.get(i));
        }

        productsInfiniteDto.setProductsList(newArrivalsInf);
        return productsInfiniteDto;
    }

    public ProductsInfiniteDto getLastChanceInfProduct(Integer number){
        ProductsInfiniteDto productsInfiniteDto = new ProductsInfiniteDto();
        List<ProductDto> lastChance = getLastChanceProducts();

        if(lastChance == null || lastChance.size() == 0){
            productsInfiniteDto.setHasMoreData(false);
            return productsInfiniteDto;
        }

        Integer from = (number * NUMBER_PER_CALL) - NUMBER_PER_CALL;
        Integer to = (number * NUMBER_PER_CALL);

        if(from > lastChance.size()-1){
            productsInfiniteDto.setHasMoreData(false);
            return productsInfiniteDto;
        }

        if(number * NUMBER_PER_CALL >= lastChance.size()){
            to = lastChance.size();
            productsInfiniteDto.setHasMoreData(false);
        }

        List<ProductDto> lastChanceInf = new ArrayList<>();

        for(int i = from; i < to; i++){
            lastChanceInf.add(lastChance.get(i));
        }
        productsInfiniteDto.setProductsList(lastChanceInf);
        return productsInfiniteDto;
    }

    public ProductDetailsDto getMostExpensiveProduct(){
        List<Product> products = productRepository.findByOrderByStartPrice();
        if(products==null || products.size()==0)
            return null;
        Product product = products.get(products.size()-1);

        if(product!=null){
            ModelMapper modelMapper = new ModelMapper();
            ProductDetailsDto productDetailsDto = modelMapper.map(product, ProductDetailsDto.class);
            productDetailsDto.setStartPriceText(df.format(productDetailsDto.getStartPrice()));

            return productDetailsDto;
        }
        return null;
    }

    public List<ProductDto> searchProductsByName(String productName){
        List<Product> products = productRepository.findAll();

       if(products==null)
           return null;

        List<Product> productsWithMatchingName = new ArrayList<>();

        for (Product product: products) {
            if(product.getName().toLowerCase().contains(productName.toLowerCase())){
                productsWithMatchingName.add(product);
            }
        }

        if(productsWithMatchingName.size()>10)
            productsWithMatchingName = productsWithMatchingName.subList(0,9);

        List<ProductDto> productDtos = changeToDto(productsWithMatchingName);
        return productDtos;
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

                productDto.setStartPriceText(df.format(productDto.getStartPrice()));
                productDtos.add(productDto);
            }
        }
        return productDtos;
    }

}
