package com.app.auctionbackend.helper;

import com.app.auctionbackend.dtos.ProductDto;
import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.repo.BidRepository;
import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service("recommendedProductsAlgorithm")
public class RecommendedProductsAlgorithm {

    @Autowired
    private ProductService productService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private BidRepository bidRepository;

    private List<Product> getTop4Products(List<Product> products){
        List<Product> productsTop4 = new ArrayList<>();
        for (int i = 0; i < 4; i++){
            productsTop4.add(products.get(i));
        }
        return productsTop4;
    }

    private List<ProductDto> getMostPopularProducts(){
        List<Product> products = productService.getAvailableActiveCustomersProducts();

        if(products == null || products.isEmpty())
            return null;

        Comparator<Product> compareByBidsCount = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

        Collections.sort(products, compareByBidsCount);

        if(products.size() <= 4){
            return productService.changeToDto(products);
        }
        else{
            List<Product> productsTop4 = getTop4Products(products);
            return productService.changeToDto(productsTop4);
        }
    }

    private List<Product> getOtherCustomerProducts(List<Product> products, Customer customer){
        List<Product> otherCustomerProducts = new ArrayList<>();
        for (Product p : products) {
            if(p.getCustomer() != null){
                if(p.getCustomer().getId() != customer.getId()){
                    otherCustomerProducts.add(p);
                }
            }
            else {
                otherCustomerProducts.add(p);
            }
        }
        return otherCustomerProducts;
    }

    private List<ProductDto> getMostPopularOtherCustomersProducts(Customer customer){
        List<Product> products = productService.getAvailableActiveCustomersProducts();

        if(products == null || products.isEmpty())
            return new ArrayList<>();

        List<Product> otherCustomerProducts = getOtherCustomerProducts(products, customer);

        if(otherCustomerProducts.isEmpty())
            return new ArrayList<>();

        Comparator<Product> compareByBidsCount = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

        Collections.sort(otherCustomerProducts, compareByBidsCount);

        if(otherCustomerProducts.size() <= 4){
            return productService.changeToDto(otherCustomerProducts);
        }
        else{
            List<Product> otherCustomerProductsTop4 = getTop4Products(otherCustomerProducts);
            return productService.changeToDto(otherCustomerProductsTop4);
        }
    }

    private void getRecommendedProductsList4(Integer size, Integer counter, List<ProductDto> mostPopularProducts, List<ProductDto> recommendedProducts){

        while (size < 4){
            ProductDto nextProduct = mostPopularProducts.get(counter);
            Boolean addProduct = true;
            for (ProductDto p : recommendedProducts) {
                if(p.getId() == nextProduct.getId()){
                    addProduct = false;
                }
            }
            if(addProduct) {
                recommendedProducts.add(mostPopularProducts.get(counter));
                size++;
            }
            counter++;
            if(counter > 3)
                break;
        }
    }

    private List<ProductDto> getRecommendedProductsList(List<Product> recommendableProducts, Customer customer){
        int size = recommendableProducts.size();
        int counter = 0;

        List<ProductDto> mostPopularProducts = getMostPopularOtherCustomersProductsThatCustomerDidNotBided(customer);

        if(mostPopularProducts.size() <= 0)
            return productService.changeToDto(recommendableProducts);

        List<ProductDto> recommendedProducts = productService.changeToDto(recommendableProducts);

        getRecommendedProductsList4(size,counter, mostPopularProducts, recommendedProducts);

        return recommendedProducts;
    }

    private void addOtherCustomerProducts(Product p, Customer customer, List<Product> otherCustomerProducts){
        Boolean customerPlacedBid = false;
        List<Bid> bids = bidRepository.findByProductIdOrderByBidPrice(p.getId());
        for (Bid bid : bids) {
            if(bid.getCustomer().getId() == customer.getId()){
                customerPlacedBid = true;
                break;
            }
        }
        if(!customerPlacedBid)
            otherCustomerProducts.add(p);
    }

    private List<Product>  getOtherCustomerProductsThatCustomerDidNotBid(List<Product> products, Customer customer){
        List<Product> otherCustomerProducts = new ArrayList<>();
        for (Product p : products) {
            if(p.getCustomer() != null){
                if(p.getCustomer().getId() != customer.getId()){
                    addOtherCustomerProducts(p, customer, otherCustomerProducts);
                }
            }
            else {
                addOtherCustomerProducts(p, customer, otherCustomerProducts);
            }
        }
        return otherCustomerProducts;
    }

    private List<ProductDto> getMostPopularOtherCustomersProductsThatCustomerDidNotBided(Customer customer){
        List<Product> products = productService.getAvailableActiveCustomersProducts();

        if(products == null || products.isEmpty())
            return new ArrayList<>();

        List<Product> otherCustomerProducts = getOtherCustomerProductsThatCustomerDidNotBid(products, customer);


        if(otherCustomerProducts.isEmpty())
            return new ArrayList<>();

        Comparator<Product> compareByBidsCount = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

        Collections.sort(otherCustomerProducts, compareByBidsCount);

        if(otherCustomerProducts.size() <= 4){
            return productService.changeToDto(otherCustomerProducts);
        }
        else{
            List<Product> otherCustomerProductsTop4 = getTop4Products(otherCustomerProducts);
            return productService.changeToDto(otherCustomerProductsTop4);
        }
    }

    public List<Integer> getCustomerThatBidProductsIds(List<Product> biddedProducts, Customer customer){

        List<Integer> customerThatBidProductsIds = new ArrayList<>();

        for (Product biddedProduct : biddedProducts) {
            List<Bid> productBids = biddedProduct.getBids();
            for (Bid productBid : productBids) {
                if(productBid.getCustomer().getId() != customer.getId()){
                    Boolean customerIdAlreadyAdded = false;
                    for (Integer customerId : customerThatBidProductsIds) {
                        if(productBid.getCustomer().getId() == customerId){
                            customerIdAlreadyAdded = true;
                            break;
                        }
                    }
                    if(!customerIdAlreadyAdded)
                        customerThatBidProductsIds.add(productBid.getCustomer().getId());
                }
            }
        }

        return customerThatBidProductsIds;
    }

    private List<Product> getRecommendableProducts(List<Integer> customerThatBidProductsIds, Customer customer){

        List<Product> recommendableProducts = new ArrayList<>();

        for (Integer customerId : customerThatBidProductsIds) {
            List<Bid> customerIdBids = bidRepository.findByCustomerIdOrderByBidPrice(customerId);
            for (Bid b : customerIdBids) {
                Product p = b.getProduct();
                Boolean available = false;
                Boolean customerBidOnProduct = false;
                Boolean customerSellsProduct = false;
                if(p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now()) && p.getCustomer().getActive()){
                    available = true;
                }
                if(p.getCustomer().getId() == customer.getId())
                    customerSellsProduct = true;

                List<Bid> productBids = p.getBids();
                for (Bid productBid: productBids) {
                    if(productBid.getCustomer().getId() == customer.getId()){
                        customerBidOnProduct = true;
                        break;
                    }
                }
                if(available && !customerBidOnProduct && !customerSellsProduct){
                    Boolean productIsInList = false;
                    for (Product recommendable : recommendableProducts) {
                        if(recommendable.getId() == p.getId()){
                            productIsInList = true;
                            break;
                        }
                    }
                    if(!productIsInList){
                        recommendableProducts.add(p);
                    }
                }
            }
        }
        return recommendableProducts;
    }

    public List<ProductDto> getRecommendedProducts(String customerEmail){
        Customer customer = customerService.findByEmail(customerEmail);

        if(customer == null){
            return getMostPopularProducts();
        }

        List<Bid> customerBids = bidRepository.findByCustomerIdOrderByBidPrice(customer.getId());

        if(customerBids == null || customerBids.isEmpty()){
            return getMostPopularOtherCustomersProducts(customer);
        }
        else{
            List<Product> biddedProducts = new ArrayList<>();

            for (Bid bid: customerBids) {
                biddedProducts.add(bid.getProduct());
            }

            List<Integer> customerThatBidProductsIds = getCustomerThatBidProductsIds(biddedProducts, customer);

            if(customerThatBidProductsIds.size() <= 0){
                return getMostPopularOtherCustomersProductsThatCustomerDidNotBided(customer);
            }

            List<Product> recommendableProducts = getRecommendableProducts(customerThatBidProductsIds, customer);

            if(recommendableProducts.size() <= 0){
                return getMostPopularOtherCustomersProductsThatCustomerDidNotBided(customer);
            }

            Comparator<Product> compareByNumberOfBids = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

            Collections.sort(recommendableProducts, compareByNumberOfBids);

            if(recommendableProducts.size() == 4){
                return productService.changeToDto(recommendableProducts);
            }

            if(recommendableProducts.size() < 4){
                return getRecommendedProductsList(recommendableProducts, customer);
            }

            List<Product> recommendableProductsTop4 = getTop4Products(recommendableProducts);
            return productService.changeToDto(recommendableProductsTop4);
        }
    }
}

