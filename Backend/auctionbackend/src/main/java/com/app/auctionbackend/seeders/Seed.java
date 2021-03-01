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

        for(int i = 1; i <= 3; i++){
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
            p.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis. Integer nec gravida velit, eget efficitur sapien. Nunc eget auctor lorem.");
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
            pr.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis. Integer nec gravida velit, eget efficitur sapien. Nunc eget auctor lorem.");
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

        for(int i =0;i<7;i++){
            Category c = new Category();
            c.setName("Category "+(i+4));
            categoryRepository.save(c);
        }

        //
        Category c = new Category();
        c.setName("Category 11");
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
        p.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis. Integer nec gravida velit, eget efficitur sapien. Nunc eget auctor lorem.");
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
    }
}

