package com.app.auctionbackend.seeders;

import com.app.auctionbackend.model.*;
import com.app.auctionbackend.repo.*;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
public class Seed {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    SubcategoryRepository subcategoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    CustomerRepository customerRepository;

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @EventListener
    public void seed(ContextRefreshedEvent event) {

        Customer customer = new Customer();
        customer.setFirstName("Customer1");
        customer.setLastName("Lastname1");
        customer.setEmail("customer1@mail.com");
        customer.setPassword(passwordEncoder.encode("mojpass123@"));
        customerRepository.save(customer);

        for(int i = 1; i <= 30; i++){
            Category c = new Category();
            c.setName("Category "+i);
            categoryRepository.save(c);

            Subcategory subcategory = new Subcategory();
            subcategory.setName("Subcategory "+i);

            subcategory.setCategory(c);
            subcategoryRepository.save(subcategory);

            Image image = new Image();
            try{

                byte[] fileContent = FileUtils.readFileToByteArray( new File("src/main/resources/images/Sneakers2.PNG") );
                String encodedString = Base64.getEncoder().encodeToString(fileContent);
                image.setImage(encodedString);
            }
            catch (Exception ex){

            }
            List<Image> images = new ArrayList<>();
            images.add(image);

            Product p = new Product();
            p.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
            LocalDateTime endDate = LocalDateTime.of(2021,3,4,0,0);
            p.setEndDate(endDate);
            LocalDateTime startDate = LocalDateTime.of(2021,2,20,0,0);
            p.setStartDate(startDate);
            p.setName("Product");
            p.setStartPrice(50);

            images.get(0).setProduct(p);

            p.setImageList(images);

            productRepository.save(p);
            imageRepository.save(image);


            Image image2 = new Image();
            try{

                byte[] fileContent = FileUtils.readFileToByteArray( new File("src/main/resources/images/Sneakers2.PNG") );
                String encodedString = Base64.getEncoder().encodeToString(fileContent);
                image2.setImage(encodedString);

            }
            catch (Exception ex){

            }
            List<Image> images2 = new ArrayList<>();
            images2.add(image2);


            Product pr = new Product();
            pr.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis. ");
            LocalDateTime endDate2 = LocalDateTime.of(2021,3,28,0,0);
            pr.setEndDate(endDate2);
            LocalDateTime startDate2 = LocalDateTime.of(2021,2,27,0,0);
            pr.setStartDate(startDate2);
            pr.setName("Product");
            pr.setStartPrice(100);

            images2.get(0).setProduct(pr);

            pr.setImageList(images2);

            productRepository.save(pr);
            imageRepository.save(image2);

            List<Product> products = new ArrayList<>();
            products.add(p);
            products.add(pr);
            subcategory.setProducts(products);

            subcategoryRepository.save(subcategory);
        }

       /* for(int i =0;i<7;i++){
            Category c = new Category();
            c.setName("Category "+(i+4));
            categoryRepository.save(c);
        }*/

        //
        Category c = new Category();
        c.setName("Category A");
        categoryRepository.save(c);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");

        subcategory.setCategory(c);
        subcategoryRepository.save(subcategory);

        Image image = new Image();
        try{

            byte[] fileContent = FileUtils.readFileToByteArray( new File("src/main/resources/images/Sneakers2.PNG") );
            String encodedString = Base64.getEncoder().encodeToString(fileContent);
            image.setImage(encodedString);
        }
        catch (Exception ex){

        }
        List<Image> images = new ArrayList<>();
        images.add(image);

        Product p = new Product();
        p.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDate = LocalDateTime.of(2021,3,3,0,0);
        p.setEndDate(endDate);
        LocalDateTime startDate = LocalDateTime.of(2021,2,20,0,0);
        p.setStartDate(startDate);
        p.setName("Product");
        p.setStartPrice(50);

        images.get(0).setProduct(p);

        p.setImageList(images);

        productRepository.save(p);
        imageRepository.save(image);

        //

        Category c1 = new Category();
        c1.setName("Category B");
        categoryRepository.save(c1);

        Subcategory subcategory1 = new Subcategory();
        subcategory1.setName("Subcategory");

        subcategory1.setCategory(c1);
        subcategoryRepository.save(subcategory1);

        Image image1 = new Image();
        try{

            byte[] fileContent = FileUtils.readFileToByteArray( new File("src/main/resources/images/Sneakers2.PNG") );
            String encodedString = Base64.getEncoder().encodeToString(fileContent);
            image1.setImage(encodedString);
        }
        catch (Exception ex){

        }
        List<Image> images1 = new ArrayList<>();
        images1.add(image1);

        Product p1 = new Product();
        p1.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDate1 = LocalDateTime.of(2021,3,3,0,0);
        p1.setEndDate(endDate1);
        LocalDateTime startDate1 = LocalDateTime.of(2021,2,20,0,0);
        p1.setStartDate(startDate1);
        p1.setName("Product");
        p1.setStartPrice(50);

        images1.get(0).setProduct(p1);

        p1.setImageList(images1);

        productRepository.save(p1);
        imageRepository.save(image1);

        //


    }
}

