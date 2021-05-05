package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.*;
import com.app.auctionbackend.helper.FuzzyScore;
import com.app.auctionbackend.model.*;
import com.app.auctionbackend.repo.BidRepository;
import com.app.auctionbackend.repo.ProductRepository;
import io.swagger.models.auth.In;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.plaf.LabelUI;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;


import static com.app.auctionbackend.config.MessageConstants.EMAIL_30_DAYS_PAST_SUBJECT;
import static com.app.auctionbackend.config.MessageConstants.EMAIL_MESSAGE;
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
    CategoryService categoryService;

    @Autowired
    EmailService emailService;

    @Autowired
    NotificationService notificationService;

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
                Bid highestBid = bidList.get(bidList.size() - 1);
                productDetailsDto.setHighestBid(highestBid.getBidPrice());
                productDetailsDto.setNumberOfBids(bidList.size());
            }

            productDetailsDto.setStartPriceText(df.format(productDetailsDto.getStartPrice()));

            productDetailsDto.setHighestBidText(df.format(productDetailsDto.getHighestBid()));

            long diff = ChronoUnit.DAYS.between(LocalDateTime.now(),product.getEndDate());
            productDetailsDto.setTimeLeft(diff);

            if(product.getEndDate().isBefore(LocalDateTime.now()) ||
                    product.getStartDate().isAfter(LocalDateTime.now())){
                productDetailsDto.setActiveProduct(false);
                productDetailsDto.setTimeLeft(0);
            }

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

    private List<Integer> getNamesFuzzyScore(FuzzyScore fuzzyScore, List<String> availableProductNames, String searchName){
        List<Integer> availableProductNameFuzzyScore = new ArrayList<>();

        for (String productName : availableProductNames) {
            int score = fuzzyScore.fuzzyScore(productName, searchName);
            availableProductNameFuzzyScore.add(score);
        }

        return availableProductNameFuzzyScore;
    }

    private List<Integer> getCategory_SubcategoryNamesFuzzyScore(FuzzyScore fuzzyScore, List<String> names, String searchName) {
        List<Integer> availableProductNameFuzzyScore = new ArrayList<>();
        for (String name : names) {
            int score = fuzzyScore.getFuzzyScore(name, searchName);
            availableProductNameFuzzyScore.add(score);
        }
        return availableProductNameFuzzyScore;
    }

    private Integer getNamesFuzzyScoreMaximumScore(List<Integer> availableProductNameFuzzyScore){
        Integer maximumScore = Integer.MIN_VALUE;

        for(int i = 0; i < availableProductNameFuzzyScore.size(); i++){
            if(availableProductNameFuzzyScore.get(i) > maximumScore){
                maximumScore = availableProductNameFuzzyScore.get(i);
            }
        }
        return maximumScore;
    }

    private List<Integer> getAvailableProductFuzzyScoreMaxIndexes(List<Integer> availableProductNameFuzzyScore, Integer maximumScore){
        List<Integer> maxScoreIndexes = new ArrayList<>();

        for(int i = 0; i < availableProductNameFuzzyScore.size(); i++){
            if(availableProductNameFuzzyScore.get(i) == maximumScore){
                maxScoreIndexes.add(i);
            }
        }
        return maxScoreIndexes;
    }

    private List<String> getMatchingProductNames(List<Integer> maxScoreIndexes, List<String> availableProductNames){
        List<String> matchingProductNames = new ArrayList<>();
        for (Integer index : maxScoreIndexes) {
            matchingProductNames.add(availableProductNames.get(index));
        }
        return matchingProductNames;
    }

    public List<String> getMatchingProductNameWords(List<String> matchingProductNames){
        List<String> words = new ArrayList<>();

            for (String name : matchingProductNames) {
                if(name.contains(" ")){
                    String[] wordParts = name.split(" ");
                    for (int i = 0; i < wordParts.length; i++){
                        words.add(wordParts[i]);
                    }
                }
                else{
                    words.add(name);
                }
            }
        return words;
    }

    List<Integer> getWordsSimilarityScores(List<String> words, FuzzyScore fuzzyScore, String searchName) {
        List<Integer> wordsSimilarityScores = new ArrayList<>();
        for (String word : words) {

            int score1 = fuzzyScore.fuzzyScore(word, searchName);
            int score2 = fuzzyScore.fuzzyScore(searchName, word);

            int score = Integer.max(score1,score2);
            wordsSimilarityScores.add(score);
        }
        return wordsSimilarityScores;
    }

    Integer getIndexOfMaxWordScore(List<Integer> wordsSimilarityScores) {
        Integer maxWordsScore = Integer.MIN_VALUE;
        Integer indexOfMaxWordsScore = -1;

        for (int i = 0; i < wordsSimilarityScores.size(); i++) {
            if (wordsSimilarityScores.get(i) > maxWordsScore) {
                maxWordsScore = wordsSimilarityScores.get(i);
                indexOfMaxWordsScore = i;
            }
        }
        return indexOfMaxWordsScore;
    }

    private Boolean checkIfHasMoreMaxScores(List<Integer> wordsSimilarityScores){
        int maxScore = Collections.max(wordsSimilarityScores);
        int maxScoreCount = 0;
        for (Integer score: wordsSimilarityScores) {
            if(score == maxScore)
                maxScoreCount++;
        }
        if(maxScoreCount > 1)
            return true;
        return false;
    }

    private DidYouMeanDto separateToSmallerWords(List<String> matchingProductNames,String searchName, FuzzyScore fuzzyScore, List<ProductDto> filteredProducts) {
        List<String> words = getMatchingProductNameWords(matchingProductNames);

        DidYouMeanDto didYouMeanDto = new DidYouMeanDto();

        List<Integer> wordsSimilarityScores = getWordsSimilarityScores(words, fuzzyScore, searchName);
        Integer indexOfMaxWordScore1 = getIndexOfMaxWordScore(wordsSimilarityScores);

        if (indexOfMaxWordScore1 != -1) {
            String mostSimilarWord1 = words.get(indexOfMaxWordScore1);
            String mostSimilar = mostSimilarWord1.substring(0, 1).toUpperCase() + mostSimilarWord1.substring(1);

            List<ProductDto> matchingProducts;
            if (filteredProducts == null)
                matchingProducts = searchProductsByName(mostSimilar);
            else
                matchingProducts = searchProductsByName(mostSimilar, filteredProducts);

            didYouMeanDto.setMatchingProducts(matchingProducts);

            if (matchingProducts == null || matchingProducts.size() <= 0) {
                didYouMeanDto.setDidYouMeanString(null);
            } else {
                didYouMeanDto.setDidYouMeanString(mostSimilar);
            }

            return didYouMeanDto;
        }
        return null;
    }

    private DidYouMeanDto getDidYouMeanProducts(List<Integer> availableProductNameFuzzyScore, List<String> availableProductNames, Integer maxScore, String searchName, FuzzyScore fuzzyScore, List<ProductDto> filteredProducts){
        List<Integer> maxScoreIndexes = getAvailableProductFuzzyScoreMaxIndexes(availableProductNameFuzzyScore, maxScore);

        List<String> matchingProductNames = getMatchingProductNames(maxScoreIndexes, availableProductNames);

        DidYouMeanDto didYouMeanDto = new DidYouMeanDto();


        if(checkIfHasMoreMaxScores(availableProductNameFuzzyScore) && searchName.contains(" ")){
            Integer indexOfMaxWordScore = getIndexOfMaxWordScore(maxScoreIndexes);

            if (indexOfMaxWordScore != -1) {
                String mostSimilarWord = matchingProductNames.get(indexOfMaxWordScore);
                if(mostSimilarWord.contains(" ")){
                   return separateToSmallerWords(matchingProductNames, searchName, fuzzyScore, filteredProducts);
                }
            }
        }

        if (checkIfHasMoreMaxScores(availableProductNameFuzzyScore) && !searchName.contains(" ")) {
            return separateToSmallerWords(matchingProductNames, searchName, fuzzyScore, filteredProducts);
        }

        Integer indexOfMaxWordScore = -1;
        if(matchingProductNames.size() > 1){
           indexOfMaxWordScore = getIndexOfMaxWordScore(maxScoreIndexes);
        }
       else if(matchingProductNames.size() == 1){
            indexOfMaxWordScore = 0;
        }


        if (indexOfMaxWordScore != -1) {

            String mostSimilarWord = matchingProductNames.get(indexOfMaxWordScore);
            String mostSimilar = mostSimilarWord.substring(0, 1).toUpperCase() + mostSimilarWord.substring(1);

            List<ProductDto> matchingProducts;
            if(filteredProducts == null)
                matchingProducts = searchProductsByName(mostSimilar);
            else{
                matchingProducts = searchProductsByName(mostSimilar, filteredProducts);
            }

            didYouMeanDto.setMatchingProducts(matchingProducts);

            if(matchingProducts == null || matchingProducts.size() <= 0){
                didYouMeanDto.setDidYouMeanString(null);
            }
            else{
                didYouMeanDto.setDidYouMeanString(mostSimilar);
            }

            return didYouMeanDto;
        }
        return null;
    }

    private DidYouMeanDto getDidYouMeanCategories(List<Integer> categoryNameFuzzyScores, List<String> categoryNames, List<ProductDto> filteredProducts){
        Integer indexOfMaxWordScore = getIndexOfMaxWordScore(categoryNameFuzzyScores);

        DidYouMeanDto didYouMeanDto = new DidYouMeanDto();

        if (indexOfMaxWordScore != -1) {
            String mostSimilarWord = categoryNames.get(indexOfMaxWordScore);
            String mostSimilar = mostSimilarWord.substring(0, 1).toUpperCase() + mostSimilarWord.substring(1);

            didYouMeanDto.setDidYouMeanString(mostSimilar);

            if(filteredProducts == null){
                Category category = categoryService.getCategoryByName(mostSimilar);
                if(category != null) {
                    List<ProductDto> matchingProducts = getProductsByCategoryId(category.getId());
                    didYouMeanDto.setMatchingProducts(matchingProducts);
                }
            }
            else{
                Category category = categoryService.getCategoryByName(mostSimilar);
                if(category != null) {
                    List<ProductDto> matchingProducts = getProductsWithCategoryId(category.getId(), filteredProducts);
                    didYouMeanDto.setMatchingProducts(matchingProducts);
                }
                else{
                    didYouMeanDto.setDidYouMeanString(null);
                }
            }
            return didYouMeanDto;
        }
        return null;
    }

    private DidYouMeanDto getDidYouMeanSubcategories(List<Integer> subcategoryNameFuzzyScores, List<String> subcategoryNames, List<ProductDto> filteredProducts){
        Integer indexOfMaxWordScore = getIndexOfMaxWordScore(subcategoryNameFuzzyScores);

        DidYouMeanDto didYouMeanDto = new DidYouMeanDto();

        if (indexOfMaxWordScore != -1) {
            String mostSimilarWord = subcategoryNames.get(indexOfMaxWordScore);
            String mostSimilar = mostSimilarWord.substring(0, 1).toUpperCase() + mostSimilarWord.substring(1);


            if(filteredProducts == null){
                Subcategory subcategory = subcategoryService.getSubcategoryByName(mostSimilar);
                if(subcategory != null){
                    List<ProductDto> matchingProducts = getProductsBySubcategoryId(subcategory.getId());
                    didYouMeanDto.setMatchingProducts(matchingProducts);
                    didYouMeanDto.setDidYouMeanString(mostSimilar);
                }
            }
            return didYouMeanDto;
        }
        return null;
    }

    private DidYouMeanDto getDidYouMeanMostMatchingString(String searchName, List<ProductDto> filteredProducts){
        if(searchName == null)
            return null;

        searchName = searchName.trim();

        if(searchName.equals(""))
            return null;

        List<Product> products = productRepository.findAll();
        List<CategoryDto> categories = categoryService.getAllCategories();
        List<Subcategory> subcategories = subcategoryService.getAllSubcategories();

        Integer maxScoreProducts = 0;
        Integer maxScoreCategories = 0;
        Integer maxScoreSubcategories = 0;

        FuzzyScore fuzzyScore = new FuzzyScore();

        List<String> availableProductNames = new ArrayList<>();
        List<Integer> availableProductNameFuzzyScore = new ArrayList<>();

        List<String> categoryNames = new ArrayList<>();
        List<Integer> categoryNameFuzzyScores = new ArrayList<>();

        List<String> subcategoryNames = new ArrayList<>();
        List<Integer> subcategoryNameFuzzyScores = new ArrayList<>();


        if(products != null && products.size() > 0) {

            for (Product p : products) {
                if (p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now())) {
                    availableProductNames.add(p.getName());
                }
            }

            availableProductNameFuzzyScore = getNamesFuzzyScore(fuzzyScore, availableProductNames, searchName);

            Integer maximumScore = getNamesFuzzyScoreMaximumScore(availableProductNameFuzzyScore);

            maxScoreProducts = maximumScore;

        }

        if(categories != null && categories.size() > 0){

            for (CategoryDto c : categories) {
                categoryNames.add(c.getName());
            }

            categoryNames.sort((s1,s2)-> s1.length() - s2.length());

            categoryNameFuzzyScores = getCategory_SubcategoryNamesFuzzyScore(fuzzyScore,categoryNames, searchName);

            Integer maximumScore = getNamesFuzzyScoreMaximumScore(categoryNameFuzzyScores);

            maxScoreCategories = maximumScore;
        }

        if(subcategories != null && subcategories.size() > 0){

            for (Subcategory s : subcategories) {
                subcategoryNames.add(s.getName());
            }

            subcategoryNames.sort((s1,s2)-> s1.length() - s2.length());

            subcategoryNameFuzzyScores = getCategory_SubcategoryNamesFuzzyScore(fuzzyScore, subcategoryNames, searchName);

            Integer maximumScore = getNamesFuzzyScoreMaximumScore(subcategoryNameFuzzyScores);

            maxScoreSubcategories = maximumScore;
        }

        if(maxScoreCategories <= 0 && maxScoreProducts <= 0 && maxScoreSubcategories <=0)
            return null;

        Integer maxScore = Integer.max(Integer.max(maxScoreProducts, maxScoreSubcategories), maxScoreCategories);

        DidYouMeanDto didYouMeanDto = new DidYouMeanDto();

        if(maxScore == maxScoreProducts){
            didYouMeanDto = getDidYouMeanProducts(availableProductNameFuzzyScore, availableProductNames, maxScore, searchName, fuzzyScore, filteredProducts);
            if(didYouMeanDto != null)
                return didYouMeanDto;
        }

        if(maxScore == maxScoreCategories){
            didYouMeanDto = getDidYouMeanCategories(categoryNameFuzzyScores, categoryNames, filteredProducts);

            if(didYouMeanDto != null){
                return didYouMeanDto;
            }
        }

        if(maxScore == maxScoreSubcategories){
            didYouMeanDto = getDidYouMeanSubcategories(subcategoryNameFuzzyScores, subcategoryNames, filteredProducts);
            if(didYouMeanDto != null) {
                return didYouMeanDto;
            }
        }
        return null;
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
                    DidYouMeanDto didYouMean = getDidYouMeanMostMatchingString(filterProductsDto.getProductName(), filteredProducts);
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
                    DidYouMeanDto didYouMean = getDidYouMeanMostMatchingString(filterProductsDto.getProductName(), null);
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
        if(customer == null)
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
        if(customer == null)
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
        if(customer == null)
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
            if(LocalDateTime.now().isAfter(p.getEndDate()) && bidList !=null && bidList.size() > 0 && !p.getPaid()){
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
            if(currentDate.isEqual(endDate) && bidList != null && bidList.size() > 0){
                Bid highestBid = bidList.get(bidList.size()-1);
                Customer highestBidder = highestBid.getCustomer();

                notificationService.sendNotificationToProductHighestBidder(highestBidder, p);
            }
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

    private List<ProductDto> getMostPopularProducts(){
        List<Product> products = getAvailableProducts();

        if(products == null || products.isEmpty())
            return null;

        Comparator<Product> compareByBidsCount = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

        Collections.sort(products, compareByBidsCount);

        if(products.size() <= 4){
            return changeToDto(products);
        }
        else{
            List<Product> productsTop4 = new ArrayList<>();
            for (int i = 0; i < 4; i++){
                productsTop4.add(products.get(i));
            }
            return changeToDto(productsTop4);
        }
    }

    private List<ProductDto> getMostPopularOtherCustomersProducts(Customer customer){
        List<Product> products = getAvailableProducts();

        if(products == null || products.isEmpty())
            return new ArrayList<>();

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

        if(otherCustomerProducts.isEmpty())
            return new ArrayList<>();

        Comparator<Product> compareByBidsCount = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

        Collections.sort(otherCustomerProducts, compareByBidsCount);

        if(otherCustomerProducts.size() <= 4){
            return changeToDto(otherCustomerProducts);
        }
        else{
            List<Product> otherCustomerProductsTop4 = new ArrayList<>();
            for (int i = 0; i < 4; i++){
                otherCustomerProductsTop4.add(otherCustomerProducts.get(i));
            }
            return changeToDto(otherCustomerProductsTop4);
        }
    }

    private List<ProductDto> getRecommendedProductsList(List<Product> recommendableProducts, Customer customer){
        int size = recommendableProducts.size();
        int counter = 0;

        List<ProductDto> mostPopularProducts = getMostPopularOtherCustomersProductsThatCustomerDidNotBided(customer);

        if(mostPopularProducts.size() <= 0)
            return changeToDto(recommendableProducts);

        List<ProductDto> recommendedProducts = changeToDto(recommendableProducts);

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

        return recommendedProducts;
    }

    private List<ProductDto> getMostPopularOtherCustomersProductsThatCustomerDidNotBided(Customer customer){
        List<Product> products = getAvailableProducts();

        if(products == null || products.isEmpty())
            return new ArrayList<>();

        List<Product> otherCustomerProducts = new ArrayList<>();
        for (Product p : products) {
            if(p.getCustomer() != null){
                if(p.getCustomer().getId() != customer.getId()){
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
            }
            else {
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
        }

        if(otherCustomerProducts.isEmpty())
            return new ArrayList<>();

        Comparator<Product> compareByBidsCount = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

        Collections.sort(otherCustomerProducts, compareByBidsCount);

        if(otherCustomerProducts.size() <= 4){
            return changeToDto(otherCustomerProducts);
        }
        else{
            List<Product> otherCustomerProductsTop4 = new ArrayList<>();
            for (int i = 0; i < 4; i++){
                otherCustomerProductsTop4.add(otherCustomerProducts.get(i));
            }
            return changeToDto(otherCustomerProductsTop4);
        }
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

            if(customerThatBidProductsIds.size()<=0){
                return getMostPopularOtherCustomersProductsThatCustomerDidNotBided(customer);
            }

            List<Product> recommendableProducts = new ArrayList<>();

            for (Integer customerId : customerThatBidProductsIds) {
                List<Bid> customerIdBids = bidRepository.findByCustomerIdOrderByBidPrice(customerId);
                for (Bid b : customerIdBids) {
                    Product p = b.getProduct();
                    Boolean available = false;
                    Boolean customerBidOnProduct = false;
                    Boolean customerSellsProduct = false;
                    if(p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now())){
                        available = true;
                    }
                    if(p.getCustomer().getId() == customer.getId())
                        customerSellsProduct=true;

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

            if(recommendableProducts.size() <= 0){
                return getMostPopularOtherCustomersProductsThatCustomerDidNotBided(customer);
            }

            Comparator<Product> compareByNumberOfBids = (Product p1, Product p2) -> p2.getBids().size() - p1.getBids().size();

            Collections.sort(recommendableProducts, compareByNumberOfBids);

            if(recommendableProducts.size() == 4){
                return changeToDto(recommendableProducts);
            }

            if(recommendableProducts.size() < 4){
                return getRecommendedProductsList(recommendableProducts, customer);
            }

            List<Product> recommendableProductsTop4 = new ArrayList<>();
            for (int i = 0; i < 4; i++) {
                recommendableProductsTop4.add(recommendableProducts.get(i));
            }

            return changeToDto(recommendableProductsTop4);
        }
    }
}
