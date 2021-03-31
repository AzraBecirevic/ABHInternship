package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.*;
import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.model.Image;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.model.Subcategory;
import com.app.auctionbackend.repo.BidRepository;
import com.app.auctionbackend.repo.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.beans.beancontext.BeanContextServiceRevokedEvent;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static com.app.auctionbackend.dtos.FilterProductsDto.SortType.DEFAULT_SORTING;
import static com.app.auctionbackend.helper.InfinityScrollConstants.*;

@Service("productService")
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    BidRepository bidRepository;

    DecimalFormat df = new DecimalFormat("#0.00");

    public List<ProductDto> getProducts(){

        List<Product> products = productRepository.findAll();

        if(products == null)
            return null;

        List<ProductDto> currentOfferedProducts = changeToDto(products);
        return currentOfferedProducts;
    }

    public ProductDetailsDto getProductById(Integer id){

        Product product = productRepository.findById(id).orElse(null);

        if(product != null){
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

            long diff = ChronoUnit.DAYS.between(LocalDateTime.now(),product.getEndDate());
            productDetailsDto.setTimeLeft(diff);

            return productDetailsDto;
        }
        return null;
    }

    public List<ProductDto> getProductsByCategoryId(Integer categoryId){
        List<Product> products = productRepository.findAll();

        List<Product> productsByCategoryId = new ArrayList<>();

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

        List<ProductDto> productDtos = changeToDto(productsByCategoryId);
        return productDtos;

    }

    public List<ProductDto> getNewArrivals(){
        List<Product> products = productRepository.findAll();
        List<Product> newArrivals = new ArrayList<>();

        for (Product p: products) {
            LocalDateTime now = LocalDateTime.now();
            long diff = ChronoUnit.DAYS.between(p.getStartDate(),now);
            if(diff <= 3){
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
            if(diff <= 3){
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

        if(from > newArrivals.size() - 1){
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

        if(from > lastChance.size() - 1){
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
        if(products == null || products.size() == 0)
            return null;
        Product product = products.get(products.size() - 1);

        if(product != null){
            ModelMapper modelMapper = new ModelMapper();
            ProductDetailsDto productDetailsDto = modelMapper.map(product, ProductDetailsDto.class);
            productDetailsDto.setStartPriceText(df.format(productDetailsDto.getStartPrice()));

            return productDetailsDto;
        }
        return null;
    }

    public List<ProductDto> searchProductsByName(String productName){
        List<Product> products = productRepository.findAll();

       if(products == null)
           return null;

        List<Product> productsWithMatchingName = new ArrayList<>();

        for (Product product : products) {
            if(product.getName().toLowerCase().contains(productName.toLowerCase())){
                productsWithMatchingName.add(product);
            }
        }

        List<ProductDto> productDtos = changeToDto(productsWithMatchingName);
        return productDtos;
    }

    public List<ProductDto> searchProductsByName(String productName, List<ProductDto> products){
        List<ProductDto> productsWithMatchingName = new ArrayList<>();

        for (ProductDto product : products) {
            if(product.getName().toLowerCase().contains(productName.toLowerCase())){
                productsWithMatchingName.add(product);
            }
        }

        return productsWithMatchingName;
    }

    public List<ProductDto> getProductsBySubcategoryId(Integer subcategoryId){
        List<Product> products = productRepository.findAll();
        List<Product> subcategoryProducts = new ArrayList<>();
        for (Product product : products) {
            boolean hasSubcategory = false;
            for(Subcategory subcategory : product.getSubcategories()){
                if(subcategory.getId() == subcategoryId){
                    hasSubcategory = true;
                    break;
                }
            }
            if(hasSubcategory)
                subcategoryProducts.add(product);

        }
        List<ProductDto> productDtoList = changeToDto(subcategoryProducts);
        return  productDtoList;
    }

    private double calculateAveragePrice(List<Product> products){
        double averagePrice;
        double sum = 0;
        for (Product p: products) {
            sum += p.getStartPrice();
        }
        averagePrice = sum / products.size();
        return averagePrice;
    }

    private List<Product> getAvailableProducts(){
        List<Product> products = productRepository.findAll();
        List<Product> availableProducts = new ArrayList<>();
        for (Product p : products) {
            if (p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now())){
                availableProducts.add(p);
            }
        }
        return availableProducts;
    }

    public PriceFilterDto getPriceFilterValues(){
        PriceFilterDto priceFilterDto = new PriceFilterDto();
        List<Product> availableProducts = getAvailableProducts();

        availableProducts.sort(Comparator.comparing(Product::getStartPrice));
        priceFilterDto.setMinPrice(availableProducts.get(0).getStartPrice());
        priceFilterDto.setMinPriceText(df.format(priceFilterDto.getMinPrice()));

        int lastIndex = availableProducts.size()-1;
        priceFilterDto.setMaxPrice(availableProducts.get(lastIndex).getStartPrice());
        priceFilterDto.setMaxPriceText(df.format(priceFilterDto.getMaxPrice()));

        double averagePrice = calculateAveragePrice(availableProducts);

        priceFilterDto.setAveragePrice(averagePrice);
        priceFilterDto.setAveragePriceText(df.format(priceFilterDto.getAveragePrice()));

        return priceFilterDto;
    }

    public ProductsInfiniteDto getFilteredProducts(FilterProductsDto filterProductsDto){

        ProductsInfiniteDto productsInfiniteDto = new ProductsInfiniteDto();

        List<ProductDto> filteredProducts = new ArrayList<>();

        if(filterProductsDto.getSubcategoryIds() != null && !filterProductsDto.getSubcategoryIds().isEmpty()){
            for (Integer id:filterProductsDto.getSubcategoryIds()) {
                List<ProductDto> subcategoryProducts = getProductsBySubcategoryId(id);
                filteredProducts.addAll(subcategoryProducts);
            }
        }
        if(filterProductsDto.getCategoryIds() != null && !filterProductsDto.getCategoryIds().isEmpty()){
            for (Integer id: filterProductsDto.getCategoryIds()) {
                List<ProductDto> categoryProducts = getProductsByCategoryId(id);
                filteredProducts.addAll(categoryProducts);
            }
        }
        if(filterProductsDto.getProductName() != null && !filterProductsDto.getProductName().isEmpty() ){
            if((filterProductsDto.getSubcategoryIds() !=null  && !filterProductsDto.getSubcategoryIds().isEmpty())
                    || (filterProductsDto.getCategoryIds() != null && !filterProductsDto.getCategoryIds().isEmpty())){
                filteredProducts = searchProductsByName(filterProductsDto.getProductName(), filteredProducts);
            }
            else{
                filteredProducts = searchProductsByName(filterProductsDto.getProductName());
            }
        }

        if(filterProductsDto.getMinPrice() >= 0){
            filteredProducts.removeIf(p -> p.getStartPrice() < filterProductsDto.getMinPrice());
        }
        if(filterProductsDto.getMaxPrice() > 0){
            filteredProducts.removeIf(p -> p.getStartPrice() > filterProductsDto.getMaxPrice());
        }

        if( filteredProducts.size() == 0){
            productsInfiniteDto.setHasMoreData(false);
            return productsInfiniteDto;
        }

        sortFilteredProducts(filteredProducts, filterProductsDto);

        Integer number = filterProductsDto.getFetchNumber();

        Integer from = (number * FILTERED_PRODUCTS_NUMBER_PER_CALL) - FILTERED_PRODUCTS_NUMBER_PER_CALL;
        Integer to = (number * FILTERED_PRODUCTS_NUMBER_PER_CALL);

        if(from > filteredProducts.size() - 1){
            productsInfiniteDto.setHasMoreData(false);
            return productsInfiniteDto;
        }

        if(to >= filteredProducts.size()){
            to = filteredProducts.size();
            productsInfiniteDto.setHasMoreData(false);
        }

        List<ProductDto> fetchedFilteredProducts = new ArrayList<>();

        for(int i = from; i < to; i++){
            fetchedFilteredProducts.add(filteredProducts.get(i));
        }

        productsInfiniteDto.setProductsList(fetchedFilteredProducts);
        return productsInfiniteDto;
    }

    private void sortFilteredProducts(List<ProductDto> filteredProducts, FilterProductsDto filterProductsDto){
        if(filterProductsDto.getSortType() == null)
            return;

        switch (filterProductsDto.getSortType()){
            case ADDED: filteredProducts.sort(Comparator.comparing(ProductDto::getCreatedOn).reversed()); break;
            case TIME_LEFT: filteredProducts.sort(Comparator.comparing(ProductDto::getEndDate)); break;
            case PRICE_LOW_TO_HIGH: filteredProducts.sort(Comparator.comparing(ProductDto::getStartPrice)); break;
            case PRICE_HIGH_TO_LOW: filteredProducts.sort(Comparator.comparing(ProductDto::getStartPrice).reversed()); break;
            default: filteredProducts.sort(Comparator.comparing(ProductDto::getName)); break;
        }
    }

    private List<ProductDto> changeToDto(List<Product>products){
        List<ProductDto> productDtos = new ArrayList<>();

        for (Product p : products) {
            if (p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now())) {
                ProductDto productDto = new ProductDto();
                productDto.setId(p.getId());
                productDto.setName(p.getName());
                productDto.setStartPrice(p.getStartPrice());
                Image image = (p.getImageList() != null && !p.getImageList().isEmpty()) ? p.getImageList().get(0) : null;
                if (image != null)
                    productDto.setImage(image.getImage());

                productDto.setStartPriceText(df.format(productDto.getStartPrice()));
                productDto.setCreatedOn(p.getCreatedOn());
                productDto.setEndDate(p.getEndDate());
                productDto.setDescription(p.getDescription());
                productDtos.add(productDto);
            }
        }
        return productDtos;
    }

}
