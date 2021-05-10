package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.*;
import com.app.auctionbackend.helper.DidYouMeanAlgorithm;
import com.app.auctionbackend.helper.RecommendedProductsAlgorithm;
import com.app.auctionbackend.model.*;
import com.app.auctionbackend.repo.BidRepository;
import com.app.auctionbackend.repo.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;


import static com.app.auctionbackend.config.MessageConstants.EMAIL_30_DAYS_PAST_SUBJECT;
import static com.app.auctionbackend.helper.InfinityScrollConstants.*;
import static com.app.auctionbackend.helper.ValidationMessageConstants.*;

@Service("productService")
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    BidRepository bidRepository;

    @Autowired
    CustomerService customerService;

    @Autowired
    SubcategoryService subcategoryService;

    @Autowired
    ImageService imageService;

    @Autowired
    EmailService emailService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    DidYouMeanAlgorithm didYouMeanAlgorithm;

    @Autowired
    RecommendedProductsAlgorithm recommendedProductsAlgorithm;

    @Value("${test.email}")
    String testEmail;

    DecimalFormat df = new DecimalFormat("#0.00");

    private  void validateRequiredField(String field, String errorMessage) throws Exception{
        if(field == null || field.isEmpty())
            throw new Exception(errorMessage);
    }

    private void validateStartPrice(double startPrice, String errorMessage)throws Exception{
        if(startPrice <= 0)
            throw new Exception(errorMessage);
    }

    private void validateDescriptionFormat(String description, String errorMessage)throws Exception {
        if(description.length() > 700)
            throw new Exception(errorMessage);
    }

    private void validateSubcategoryRequired(Integer id, String errorMessage)throws Exception{
        if(id == null)
            throw new Exception(errorMessage);
    }

    private void validateSubcategoryFormat(Integer id, String errorMessage)throws Exception{
        if(id <= 0 || subcategoryService.findById(id) == null)
            throw new Exception(errorMessage);
    }

    private void validateProductStartDateMinValue(LocalDateTime date, String errorMessage) throws Exception{
        LocalDateTime now = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0,0);
        if(date.isBefore(now))
            throw new Exception(errorMessage);
    }

    private void validateProductStartDateMaxValue(LocalDateTime date, String errorMessage)throws Exception{
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime max = LocalDateTime.of(now.getYear()+1, date.getMonth(), date.getDayOfMonth(),0,0);
        if(date.isAfter(max))
            throw new Exception(errorMessage);
    }

    private void validateProductEndDateMinValue(LocalDateTime startDate, LocalDateTime endDate, String errorMessage)throws Exception{
        if(startDate.isAfter(endDate) || startDate.equals(endDate))
            throw new Exception(errorMessage);
    }

    private void validateProductActiveTime(LocalDateTime startDate, LocalDateTime endDate, String errorMessage)throws Exception{
        LocalDateTime max = LocalDateTime.of(startDate.getYear()+1, startDate.getMonth(), startDate.getDayOfMonth(),0,0);
        if(endDate.isAfter(max))
            throw new Exception(errorMessage);
    }

    public Boolean isProductSellerActive(Product product){
        if(product.getCustomer() != null && product.getCustomer().getActive())
            return true;
        return false;
    }

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
            if(isProductSellerActive(product)) {

                ModelMapper modelMapper = new ModelMapper();
                ProductDetailsDto productDetailsDto = modelMapper.map(product, ProductDetailsDto.class);

                List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(id);
                if (bidList == null || bidList.size() == 0) {
                    productDetailsDto.setHighestBid(0);
                    productDetailsDto.setNumberOfBids(0);
                } else {
                    Bid highestBid = bidList.get(bidList.size() - 1);
                    productDetailsDto.setHighestBid(highestBid.getBidPrice());
                    productDetailsDto.setNumberOfBids(bidList.size());
                }

                productDetailsDto.setStartPriceText(df.format(productDetailsDto.getStartPrice()));

                productDetailsDto.setHighestBidText(df.format(productDetailsDto.getHighestBid()));

                long diff = ChronoUnit.DAYS.between(LocalDateTime.now(), product.getEndDate());
                productDetailsDto.setTimeLeft(diff);

                if (product.getEndDate().isBefore(LocalDateTime.now()) ||
                        product.getStartDate().isAfter(LocalDateTime.now())) {
                    productDetailsDto.setActiveProduct(false);
                    productDetailsDto.setTimeLeft(0);
                }

                return productDetailsDto;
            }
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

        for (Product p : products) {
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

        for (Product p : products) {
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

        List<Product> activeCustomerProducts = new ArrayList<>();
        for (Product p : products) {
            if(isProductSellerActive(p))
                activeCustomerProducts.add(p);
        }
        Product product = activeCustomerProducts.get(activeCustomerProducts.size()-1);

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

    public List<Product> getAvailableActiveCustomersProducts(){
        List<Product> products = productRepository.findAll();
        List<Product> availableProducts = new ArrayList<>();
        for (Product p : products) {
            if(isProductSellerActive(p)) {
                if (p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now())) {
                    availableProducts.add(p);
                }
            }
        }
        return availableProducts;
    }

    public PriceFilterDto getPriceFilterValues(){
        PriceFilterDto priceFilterDto = new PriceFilterDto();
        List<Product> availableProducts = getAvailableActiveCustomersProducts();

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

    public List<ProductDto> getProductsWithCategoryId(Integer categoryId, List<ProductDto> productDtoList){
       List<Product> products = new ArrayList<>();

        for (ProductDto product: productDtoList) {
            Product p = productRepository.findById(product.getId()).orElse(null);
            products.add(p);
        }

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

    public ProductsInfiniteDto getFilteredProducts(FilterProductsDto filterProductsDto){

        ProductsInfiniteDto productsInfiniteDto = new ProductsInfiniteDto();

        List<ProductDto> filteredProducts = new ArrayList<>();

        if((filterProductsDto.getSubcategoryIds() == null || filterProductsDto.getSubcategoryIds().isEmpty()) &&
                (filterProductsDto.getCategoryIds() == null || filterProductsDto.getCategoryIds().isEmpty()) &&
                (filterProductsDto.getProductName().isEmpty() || filterProductsDto.getProductName().equals(""))
        ){
           filteredProducts = getProducts();
        }

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
            if((filterProductsDto.getSubcategoryIds() != null  && !filterProductsDto.getSubcategoryIds().isEmpty())
                    || (filterProductsDto.getCategoryIds() != null && !filterProductsDto.getCategoryIds().isEmpty())){

                List<ProductDto> filteredProductsByName = searchProductsByName(filterProductsDto.getProductName(), filteredProducts);

               if(filteredProductsByName.size() <= 0){
                    DidYouMeanDto didYouMean = didYouMeanAlgorithm.getDidYouMeanMostMatchingString(filterProductsDto.getProductName(), filteredProducts);
                    if(didYouMean != null){
                        filteredProducts = didYouMean.getMatchingProducts();
                        productsInfiniteDto.setDidYouMean(didYouMean.getDidYouMeanString());
                    }
                }
                else {
                    filteredProducts = filteredProductsByName;
                }
            }
            else{
                filteredProducts = searchProductsByName(filterProductsDto.getProductName());

                if(filteredProducts.size() <= 0){
                    DidYouMeanDto didYouMean = didYouMeanAlgorithm.getDidYouMeanMostMatchingString(filterProductsDto.getProductName(), null);
                    if(didYouMean != null){
                        filteredProducts = didYouMean.getMatchingProducts();
                        productsInfiniteDto.setDidYouMean(didYouMean.getDidYouMeanString());
                    }
                }
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

    public Boolean hasCustomerSellingProducts(Integer id){
        List<Product> products = productRepository.findByCustomerId(id);
        if(products != null && products.size() > 0) {
            return true;
        }
        return false;
    }

    private SellProductDto makeSellProductDto(Product p){
        SellProductDto sellProductDto = new SellProductDto();
        if(p.getImageList() == null || p.getImageList().size() <= 0)
            sellProductDto.setImage(null);
        else
            sellProductDto.setImage(p.getImageList().get(0).getImage());
        sellProductDto.setId(p.getId());
        sellProductDto.setName(p.getName());
        sellProductDto.setStartPrice(df.format(p.getStartPrice()));

        List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(p.getId());
        if(bidList == null || bidList.size() == 0){
            sellProductDto.setHighestBid(df.format(0));
            sellProductDto.setNumberOfBids(df.format(0));
            sellProductDto.setHighestBidValue(0);
        }
        else{
            Bid highestBid = bidList.get(bidList.size() - 1);
            sellProductDto.setHighestBid(df.format(highestBid.getBidPrice()));
            sellProductDto.setHighestBidValue(highestBid.getBidPrice());
            Integer numberOfBids = bidList.size();
            sellProductDto.setNumberOfBids(numberOfBids.toString());

        }

        long timeLeft = ChronoUnit.DAYS.between(LocalDateTime.now(),p.getEndDate());
        if(timeLeft < 0)
            timeLeft = 0;
        sellProductDto.setTimeLeft(timeLeft);
        return sellProductDto;
    }

    private void calculateHighestBid(List<SellProductDto> sellProductDtoList){
        double highestBid = 0;
        Integer indexOfProductWithHighestBid = -1;
        for (int i = 0; i < sellProductDtoList.size(); i++) {
            if(sellProductDtoList.get(i).getHighestBidValue() > highestBid){
                highestBid = sellProductDtoList.get(i).getHighestBidValue();
                indexOfProductWithHighestBid = i;
            }
        }
        if(indexOfProductWithHighestBid != -1)
            sellProductDtoList.get(indexOfProductWithHighestBid).setBidHighest(true);
    }

    public List<SellProductDto> getActiveProducts(String customerEmail){

        Customer customer = customerService.findByEmail(customerEmail);
        if(customer == null || !customer.getActive())
            return null;

        List<Product> products = productRepository.findByCustomerId(customer.getId());
        if(products == null)
            return null;

        List<SellProductDto> sellProductDtoList = new ArrayList<>();


        for (Product p : products) {
            if(p.getEndDate().isAfter(LocalDateTime.now())){
              SellProductDto sellProductDto = makeSellProductDto(p);
              sellProductDtoList.add(sellProductDto);
            }
        }
       calculateHighestBid(sellProductDtoList);

        return sellProductDtoList;
    }

    public List<SellProductDto> getSoldProducts(String customerEmail){
        Customer customer = customerService.findByEmail(customerEmail);
        if(customer == null || !customer.getActive())
            return null;

        List<Product> products = productRepository.findByCustomerId(customer.getId());
        if(products == null)
            return null;

        List<SellProductDto> sellProductDtoList = new ArrayList<>();

        for (Product p:products) {
            if(p.getEndDate().isBefore(LocalDateTime.now())){
                SellProductDto sellProductDto = makeSellProductDto(p);
                sellProductDtoList.add(sellProductDto);
            }
        }

        calculateHighestBid(sellProductDtoList);

        return sellProductDtoList;
    }

    public List<SellProductDto> getBidProducts(String customerEmail){
       Customer customer = customerService.findByEmail(customerEmail);
        if(customer == null || !customer.getActive())
            return null;

        List<Bid> bids = bidRepository.findByCustomerIdOrderByBidPrice(customer.getId());
        if(bids == null || bids.size() <= 0){
            return null;
        }

        List<SellProductDto> bidProducts = new ArrayList<>();

       for (Bid b : bids) {
           Product p = b.getProduct();
           SellProductDto sellProductDto = makeSellProductDto(p);
           double customerBidPrice = b.getBidPrice();
           sellProductDto.setCustomerBidPrice(df.format(customerBidPrice));

           List<Bid> productBids = bidRepository.findByProductIdOrderByBidPrice(p.getId());
           double highestProductBid = productBids.get(productBids.size() - 1).getBidPrice();
           sellProductDto.setHighestBid(df.format(highestProductBid));
           if (customerBidPrice == highestProductBid) {
               sellProductDto.setCustomerPriceHighestBid(true);
               if(p.getPaid()){
                   sellProductDto.setPaymentEnabled(false);
                   sellProductDto.setProductPaid(true);
               }
               else {
                   if (LocalDateTime.now().isAfter(p.getEndDate()))
                       sellProductDto.setPaymentEnabled(true);
               }
           }

           bidProducts.add(sellProductDto);
       }

        return bidProducts;
    }

    public Integer addProduct(AddProductDto addProductDto) throws Exception{
     Customer customer = customerService.findByEmail(addProductDto.getCustomerEmail());
     if(customer == null)
         throw new Exception(USER_DOES_NOT_EXIST);

     if(!customer.getActive())
         throw new Exception(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE);

     validateRequiredField(addProductDto.getName(), PRODUCT_NAME_REQUIRED_MESSAGE);
     validateRequiredField(addProductDto.getDescription(), DESCRIPTION_REQUIRED_MESSAGE);
     validateStartPrice(addProductDto.getStartPrice(), START_PRICE_BIGGER_THAN_0_MESSAGE);
     validateDescriptionFormat(addProductDto.getDescription(), DESCRIPTION_FORMAT_MESSAGE );
     validateSubcategoryRequired(addProductDto.getSubcategoryId(), SUBCATEGORY_REQUIRED_MESSAGE);
     validateSubcategoryFormat(addProductDto.getSubcategoryId(), SUBCATEGORY_DOES_NOT_EXIST_MESSAGE);

     LocalDateTime start_date;
     try{
         start_date = LocalDateTime.of(addProductDto.getStartDateYear(),addProductDto.getStartDateMonth(), addProductDto.getStartDateDay(),0,0);
     }
     catch (Exception ex){
         throw new Exception(START_DATE_REQUIRED_MESSAGE);
     }

     LocalDateTime end_date;
     try{
         end_date = LocalDateTime.of(addProductDto.getEndDateYear(), addProductDto.getEndDateMonth(), addProductDto.getEndDateDay(),0,0);
     }
     catch (Exception ex){
         throw new Exception(END_DATE_REQUIRED_MESSAGE);
     }

     validateProductStartDateMinValue(start_date,START_DATE_MIN_VALUE_MESSAGE);
     validateProductStartDateMaxValue(start_date,START_DATE_MAX_VALUE_MESSAGE);
     validateProductEndDateMinValue(start_date, end_date, END_DATE_MIN_VALUE_MESSAGE);
     validateProductActiveTime(start_date, end_date, PRODUCT_ACTIVE_VALUE_MESSAGE);

     Product product = new Product();
     product.setCustomer(customer);
     product.setCreatedOn(LocalDateTime.now());
     product.setModifiedOn(LocalDateTime.now());
     product.setStartPrice(addProductDto.getStartPrice());
     product.setName(addProductDto.getName());
     product.setDescription(addProductDto.getDescription());
     product.setStartDate(start_date);
     product.setEndDate(end_date);
     List<Subcategory> subcategories = new ArrayList<>();
     Subcategory subcategory = subcategoryService.findById(addProductDto.getSubcategoryId());
     subcategories.add(subcategory);
     product.setSubcategories(subcategories);

     productRepository.save(product);
     List<Product> subcategoryProducts = subcategory.getProducts();
     subcategoryProducts.add(product);
     subcategoryService.save(subcategory);

     return product.getId();
    }

    public Boolean addProductPhotos(Integer productId,MultipartFile[] imgFiles) throws Exception{

        Product product = productRepository.findById(productId).orElse(null);
        if(product == null){
            return false;
        }
        try{

            List<Image> imageList = new ArrayList<>();

            for(int i = 0; i < imgFiles.length; i++){
                byte[] fileContent = imgFiles[i].getBytes();
                String encodedString = Base64.getEncoder().encodeToString(fileContent);

                Image image = new Image();
                image.setImage(encodedString);
                image.setProduct(product);

                imageService.saveImage(image);

                imageList.add(image);
            }
            product.setImageList(imageList);
            productRepository.save(product);
            return true;
        }
        catch (Exception exception){
            return  false;
        }
    }

    public Product findProductById(Integer id){
        Product product = productRepository.findById(id).orElse(null);
        return product;
    }

    public void savePaidProduct(Integer id){
        Product product = findProductById(id);
        if(product != null){
            product.setPaid(true);
            productRepository.save(product);
        }
    }

    private String makeEmailMessage(String firstName, String lastName, String productName, String bidPrice){
       String message = new StringBuilder()
                .append("Dear ")
                .append(firstName)
                .append(" ")
                .append(lastName)
                .append(", the product payment period for ")
                .append(productName)
                .append(" (")
                .append(bidPrice)
                .append(" $) has expired.").toString();

       return message;
    }

    public void sendEmailToCustomer(Customer customer, Bid bid, Product product){
        if(customer == null){
            return;
        }

        String bidPrice = df.format( bid.getBidPrice());
        String emailMessage = makeEmailMessage(customer.getFirstName(), customer.getLastName(), product.getName(), bidPrice);

        try {                                //testEmail
            emailService.sendSimpleMessage(customer.getEmail(), EMAIL_30_DAYS_PAST_SUBJECT, emailMessage);
        }
        catch(Error err){
            return;
        }

        return;
    }

    public void sendEmailForBidProduct(){
        List<Product> products = productRepository.findAll();

        for (Product p : products) {
            List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(p.getId());
            if(LocalDateTime.now().isAfter(p.getEndDate()) && bidList != null && bidList.size() > 0 && !p.getPaid()){
                LocalDateTime endDatePayment = p.getEndDate().plusDays(30);

                LocalDateTime paymentEndDate = LocalDateTime.of(endDatePayment.getYear(), endDatePayment.getMonth(), endDatePayment.getDayOfMonth(), 0,0);
                LocalDateTime currentDate = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0,0);

                if(currentDate.isEqual(paymentEndDate)){
                    Bid highestBid = bidList.get(bidList.size()-1);
                    Customer highestBidder = highestBid.getCustomer();
                    sendEmailToCustomer(highestBidder, highestBid, p);
                }
            }

            LocalDateTime endDate = LocalDateTime.of(p.getEndDate().getYear(), p.getEndDate().getMonth(), p.getEndDate().getDayOfMonth(), 0,0);
            LocalDateTime currentDate = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0,0);
            if(currentDate.isEqual(endDate) && bidList != null && bidList.size() > 0 && !p.getPaid()){
                Bid highestBid = bidList.get(bidList.size()-1);
                Customer highestBidder = highestBid.getCustomer();

                notificationService.sendNotificationToProductHighestBidder(highestBidder, p);
            }
        }
    }

    public List<ProductDto> changeToDto(List<Product>products){
        List<ProductDto> productDtos = new ArrayList<>();

        for (Product p : products) {
            if(isProductSellerActive(p)) {
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
        }
        return productDtos;
    }

    public List<ProductDto> getRecommendedProducts(String customerEmail){
        return recommendedProductsAlgorithm.getRecommendedProducts(customerEmail);
    }
}
