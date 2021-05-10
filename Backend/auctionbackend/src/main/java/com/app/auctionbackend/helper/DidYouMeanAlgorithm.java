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

    /**
     * Calculates fuzzy score (similarity) between the search name and every name from the list of available product names.
     * Returns a list of scores for every name.
     *
     * @param fuzzyScore an object of a FuzzyScore class {@link FuzzyScore}
     * @param availableProductNames list of names of available products
     * @param searchName user search input
     * @return List<Integer>
     */
    private List<Integer> getNamesFuzzyScore(FuzzyScore fuzzyScore, List<String> availableProductNames, String searchName){
        List<Integer> availableProductNameFuzzyScore = new ArrayList<>();

        for (String productName : availableProductNames) {
            int score = fuzzyScore.fuzzyScore(productName, searchName);
            availableProductNameFuzzyScore.add(score);
        }

        return availableProductNameFuzzyScore;
    }

    /**
     * Calculates fuzzy score (similarity) between the search name and every name from the list of category/subcategory names.
     * Returns a list of scores for every name.
     *
     * @param fuzzyScore an object of a FuzzyScore class {@link FuzzyScore}
     * @param names list of subcategory or category names
     * @param searchName user search input
     * @return List<Integer>
     */
    private List<Integer> getCategorySubcategoryNamesFuzzyScore(FuzzyScore fuzzyScore, List<String> names, String searchName) {
        List<Integer> availableProductNameFuzzyScore = new ArrayList<>();
        for (String name : names) {
            int score = fuzzyScore.getFuzzyScore(name, searchName);
            availableProductNameFuzzyScore.add(score);
        }
        return availableProductNameFuzzyScore;
    }

    /**
     * Calculates the maximum value (score) from the list.
     *
     * @param availableProductNameFuzzyScore a list of names scores
     * @return Integer
     */
    private Integer getNamesFuzzyScoreMaximumScore(List<Integer> availableProductNameFuzzyScore){
        Integer maximumScore = Integer.MIN_VALUE;

        for(int i = 0; i < availableProductNameFuzzyScore.size(); i++){
            if(availableProductNameFuzzyScore.get(i) > maximumScore){
                maximumScore = availableProductNameFuzzyScore.get(i);
            }
        }
        return maximumScore;
    }

    /**
     * Stores the index of every score (from product score list), that is equal to the max score, in a new list, and returns that list in the end.
     *
     * @param availableProductNameFuzzyScore a list of scores for product names
     * @param maximumScore maximum score
     * @return List<Integer>
     */
    private List<Integer> getAvailableProductFuzzyScoreMaxIndexes(List<Integer> availableProductNameFuzzyScore, Integer maximumScore){
        List<Integer> maxScoreIndexes = new ArrayList<>();

        for(int i = 0; i < availableProductNameFuzzyScore.size(); i++){
            if(availableProductNameFuzzyScore.get(i) == maximumScore){
                maxScoreIndexes.add(i);
            }
        }
        return maxScoreIndexes;
    }

    /**
     * For every index in maxScore indexes list gets the name which is on that index in a product names list, stores that name in a new list, and returns that list in the end.
     *
     * @param maxScoreIndexes  a list of max score indexes
     * @param availableProductNames a list of product names
     * @return List<String>
     */
    private List<String> getMatchingProductNames(List<Integer> maxScoreIndexes, List<String> availableProductNames){
        List<String> matchingProductNames = new ArrayList<>();
        for (Integer index : maxScoreIndexes) {
            matchingProductNames.add(availableProductNames.get(index));
        }
        return matchingProductNames;
    }

    /**
     * Checks if there is a " " (space) in the product name, for every product name in the list.
     * In case there is space, splits every name by " ", and adds every separate word in a list of words.
     * Returns a list of separate words.
     *
     * @param matchingProductNames a list of product names which have similarities with search name
     * @return List<String>
     */
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

    /**
     * Calls a method that implements fuzzy score algorithm and calculates similarity between search name and every word form list.
     * Returns a list of similarity scores for every word.
     *
     * @param words list of words
     * @param fuzzyScore an object of a FuzzyScore class {@link FuzzyScore}
     * @param searchName user search input
     * @return List<Integer>
     */
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

    /**
     * Finds the index of maximum value in the list.
     *
     * @param wordsSimilarityScores list of similarity scores
     * @return Integer
     */
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

    /**
     * Finds the maximum value in the list, and checks if there are more maximum values (max scores) in the list.
     *
     * @param wordsSimilarityScores list of similarity scores
     * @return Boolean
     */
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

    /**
     * Calls method for splitting product names by " " (space) into words, then method for calculating similarity scores between the words and search name, finds the index of the most similar word and calls method for finding product(s) with similar name(s).
     *
     * @param matchingProductNames a list of product names which have similarities with search name
     * @param searchName user search input
     * @param fuzzyScore an object of a FuzzyScore class {@link FuzzyScore}
     * @param filteredProducts list of filtered products (filtered by category, subcategory, price)
     * @return DidYouMeanDto object
     */
    private DidYouMeanDto separateToSmallerWords(List<String> matchingProductNames, String searchName, FuzzyScore fuzzyScore, List<ProductDto> filteredProducts) {
        List<String> words = getMatchingProductNameWords(matchingProductNames);

        List<Integer> wordsSimilarityScores = getWordsSimilarityScores(words, fuzzyScore, searchName);
        Integer indexOfMaxWordScore1 = getIndexOfMaxWordScore(wordsSimilarityScores);

        return setMostSimilarProduct(indexOfMaxWordScore1,words, filteredProducts);
    }

    /**
     * Finds the most similar product name, and search for products with that most similar name.
     * Sets product(s) and most similar name in DidYouMean object and returns it.
     *
     * @param indexOfMaxWordScore an index of max score
     * @param matchingProductNames a list of product names which have similarities with search name
     * @param filteredProducts list of filtered products (filtered by category, subcategory, price)
     * @return DidYouMeanDto object
     */
    private DidYouMeanDto setMostSimilarProduct(Integer indexOfMaxWordScore, List<String> matchingProductNames, List<ProductDto> filteredProducts){
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

    /**
     * Calls methods for finding names with max scores, in case there are more names with maximum scores, calls method to separate product names in words, and find the most similar word (in case product names have more than one word),
     * else finds the index of the most similar name and calls method for finding product(s) with that name.
     *
     * @param availableProductNameFuzzyScore a list of scores of available products names (scores represent similarity between product names and search name)
     * @param availableProductNames a list of names of available products
     * @param maxScore maximum score
     * @param searchName user search input
     * @param fuzzyScore an object of a FuzzyScore class {@link FuzzyScore}
     * @param filteredProducts list of filtered products (filtered by category, subcategory, price)
     * @return DidYouMeanDto object
     */
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

    /**
     * Gets the most similar category name (name with highest score), and gets products which belong to the category with the most similar name.
     * Sets products and most similar name in DidYouMean object and returns it.
     *
     * @param categoryNameFuzzyScores list of category names scores (scores represent similarity between category names and search name)
     * @param categoryNames a list of category names
     * @param filteredProducts list of filtered products (filtered by category, subcategory, price)
     * @return DidYouMeanDto object
     */
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

    /**
     * Gets the most similar subcategory name (name with highest score), and gets products which belong to the subcategory with the most similar name.
     * Sets products and most similar name in DidYouMean object and returns it.
     *
     * @param subcategoryNameFuzzyScores a list of subcategory names scores (scores represent similarity between subcategory names and search name)
     * @param subcategoryNames a list of subcategory names
     * @param filteredProducts list of filtered products (filtered by category, subcategory, price)
     * @return DidYouMeanDto object
     */
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

    /**
     * Finds all available products from products list (product seller is active, and the current date is between the start date and the end date of the product auction).
     * Returns a list of names of available products.
     *
     * @param products a list of products
     * @return List<String>
     */
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

    /**
     * Gets name of every category from the list.
     * Returns a list with categories names.
     *
     * @param categories list of categories
     * @return List<String>
     */
    private List<String> getCategoryNames(List<CategoryDto> categories){
        List<String> categoryNames = new ArrayList<>();
        for (CategoryDto c : categories) {
            categoryNames.add(c.getName());
        }
        return categoryNames;
    }

    /**
     * Gets name of every subcategory from the list.
     * Returns a list with subcategories names.
     *
     * @param subcategories a list of subcategories
     * @return List<String>
     */
    private List<String> getSubcategoryNames(List<Subcategory> subcategories){
        List<String> subcategoryNames = new ArrayList<>();
        for (Subcategory s : subcategories) {
            subcategoryNames.add(s.getName());
        }
        return subcategoryNames;
    }

    /**
     * Finds products, categories and subcategories names and gets scores that represent similarity with searchName.
     * Determines the max score, and depending on the max score value, gets the product/category/subcategory with the most similar name.
     *
     * @param searchName user search input
     * @param filteredProducts list of filtered products (filtered by category, subcategory, price)
     * @return DidYouMean object
     */
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

            categoryNameFuzzyScores = getCategorySubcategoryNamesFuzzyScore(fuzzyScore,categoryNames, searchName);

            maxScoreCategories = getNamesFuzzyScoreMaximumScore(categoryNameFuzzyScores);
        }

        if(subcategories != null && subcategories.size() > 0){
            subcategoryNames = getSubcategoryNames(subcategories);

            subcategoryNames.sort((s1,s2)-> s1.length() - s2.length());

            subcategoryNameFuzzyScores = getCategorySubcategoryNamesFuzzyScore(fuzzyScore, subcategoryNames, searchName);

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
