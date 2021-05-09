package com.app.auctionbackend.helper;

import com.app.auctionbackend.dtos.CategoryDto;
import com.app.auctionbackend.dtos.DidYouMeanDto;
import com.app.auctionbackend.dtos.ProductDto;
import com.app.auctionbackend.model.Category;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.model.Subcategory;
import com.app.auctionbackend.repo.ProductRepository;
import com.app.auctionbackend.service.CategoryService;
import com.app.auctionbackend.service.ProductService;
import com.app.auctionbackend.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service("didYouMeanAlgorithm")
public class DidYouMeanAlgorithm {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SubcategoryService subcategoryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;


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

    private DidYouMeanDto separateToSmallerWords(List<String> matchingProductNames, String searchName, FuzzyScore fuzzyScore, List<ProductDto> filteredProducts) {
        List<String> words = getMatchingProductNameWords(matchingProductNames);

        List<Integer> wordsSimilarityScores = getWordsSimilarityScores(words, fuzzyScore, searchName);
        Integer indexOfMaxWordScore1 = getIndexOfMaxWordScore(wordsSimilarityScores);

        return setMostSimilarProduct(indexOfMaxWordScore1,words, filteredProducts);
    }

    private DidYouMeanDto setMostSimilarProduct(Integer indexOfMaxWordScore, List<String> matchingProductNames, List<ProductDto> filteredProducts/*, /*DidYouMeanDto didYouMeanDto*/){
        if (indexOfMaxWordScore != -1) {
            DidYouMeanDto didYouMeanDto = new DidYouMeanDto();
            String mostSimilarWord = matchingProductNames.get(indexOfMaxWordScore);
            String mostSimilar = mostSimilarWord.substring(0, 1).toUpperCase() + mostSimilarWord.substring(1);

            List<ProductDto> matchingProducts;
            if (filteredProducts == null)
                matchingProducts = productService.searchProductsByName(mostSimilar);
            else {
                matchingProducts = productService.searchProductsByName(mostSimilar, filteredProducts);
            }

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

        return setMostSimilarProduct(indexOfMaxWordScore, matchingProductNames, filteredProducts);
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
                    List<ProductDto> matchingProducts = productService.getProductsByCategoryId(category.getId());
                    didYouMeanDto.setMatchingProducts(matchingProducts);
                }
            }
            else{
                Category category = categoryService.getCategoryByName(mostSimilar);
                if(category != null) {
                    List<ProductDto> matchingProducts = productService.getProductsWithCategoryId(category.getId(), filteredProducts);
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
                    List<ProductDto> matchingProducts = productService.getProductsBySubcategoryId(subcategory.getId());
                    didYouMeanDto.setMatchingProducts(matchingProducts);
                    didYouMeanDto.setDidYouMeanString(mostSimilar);
                }
            }
            return didYouMeanDto;
        }
        return null;
    }

    private List<String> getAvailableProductNames(List<Product> products){
        List<String> availableProductNames = new ArrayList<>();
        for (Product p : products) {
            if(productService.isProductSellerActive(p)) {
                if (p.getStartDate().isBefore(LocalDateTime.now()) && p.getEndDate().isAfter(LocalDateTime.now())) {
                    availableProductNames.add(p.getName());
                }
            }
        }
        return availableProductNames;
    }

    private List<String> getCategoryNames(List<CategoryDto> categories){
        List<String> categoryNames = new ArrayList<>();
        for (CategoryDto c : categories) {
            categoryNames.add(c.getName());
        }
        return categoryNames;
    }

    private List<String> getSubcategoryNames(List<Subcategory> subcategories){
        List<String> subcategoryNames = new ArrayList<>();
        for (Subcategory s : subcategories) {
            subcategoryNames.add(s.getName());
        }
        return subcategoryNames;
    }

    public DidYouMeanDto getDidYouMeanMostMatchingString(String searchName, List<ProductDto> filteredProducts){
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
            availableProductNames = getAvailableProductNames(products);

            availableProductNameFuzzyScore = getNamesFuzzyScore(fuzzyScore, availableProductNames, searchName);

            maxScoreProducts = getNamesFuzzyScoreMaximumScore(availableProductNameFuzzyScore);
        }

        if(categories != null && categories.size() > 0){
            categoryNames = getCategoryNames(categories);

            categoryNames.sort((s1,s2)-> s1.length() - s2.length());

            categoryNameFuzzyScores = getCategory_SubcategoryNamesFuzzyScore(fuzzyScore,categoryNames, searchName);

            maxScoreCategories = getNamesFuzzyScoreMaximumScore(categoryNameFuzzyScores);
        }

        if(subcategories != null && subcategories.size() > 0){
            subcategoryNames = getSubcategoryNames(subcategories);

            subcategoryNames.sort((s1,s2)-> s1.length() - s2.length());

            subcategoryNameFuzzyScores = getCategory_SubcategoryNamesFuzzyScore(fuzzyScore, subcategoryNames, searchName);

            maxScoreSubcategories = getNamesFuzzyScoreMaximumScore(subcategoryNameFuzzyScores);
        }

        if(maxScoreCategories <= 0 && maxScoreProducts <= 0 && maxScoreSubcategories <=0)
            return null;

        Integer maxScore = Integer.max(Integer.max(maxScoreProducts, maxScoreSubcategories), maxScoreCategories);


        if(maxScore.equals(maxScoreProducts)){
           DidYouMeanDto didYouMeanDto = getDidYouMeanProducts(availableProductNameFuzzyScore, availableProductNames, maxScore, searchName, fuzzyScore, filteredProducts);
            if(didYouMeanDto != null)
                return didYouMeanDto;
        }

        if(maxScore.equals(maxScoreCategories)){
           DidYouMeanDto didYouMeanDto = getDidYouMeanCategories(categoryNameFuzzyScores, categoryNames, filteredProducts);
            if(didYouMeanDto != null){
                return didYouMeanDto;
            }
        }

        if(maxScore.equals(maxScoreSubcategories)){
            DidYouMeanDto didYouMeanDto = getDidYouMeanSubcategories(subcategoryNameFuzzyScores, subcategoryNames, filteredProducts);
            if(didYouMeanDto != null) {
                return didYouMeanDto;
            }
        }
        return null;
    }

}
