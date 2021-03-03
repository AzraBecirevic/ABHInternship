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

    public Image getImageData(String path){
        Image image = new Image();
        try{

            byte[] fileContent = FileUtils.readFileToByteArray( new File(path) );
            String encodedString = Base64.getEncoder().encodeToString(fileContent);
            image.setImage(encodedString);
            return image;
        }
        catch (Exception ex){

        }
        return image;
    }

    @EventListener
    public void seed(ContextRefreshedEvent event) {

        Customer customer = new Customer();
        customer.setFirstName("Customer1");
        customer.setLastName("Lastname1");
        customer.setEmail("customer1@mail.com");
        customer.setPassword(passwordEncoder.encode("mojpass123@"));
        customerRepository.save(customer);


        Category women = new Category();
        women.setName("Women");
        categoryRepository.save(women);

        Subcategory womenClothes = new Subcategory();
        womenClothes.setName("Clothes");
        womenClothes.setCategory(women);
        subcategoryRepository.save(womenClothes);

        Image womenTShirtImage1 = getImageData("src/main/resources/images/womenTShirt.jpg");
        Image womenTShirtImage2 = getImageData("src/main/resources/images/womenTShirt.jpg");
        Image womenTShirtImage3 = getImageData("src/main/resources/images/womenTShirt.jpg");
        Image womenTShirtImage4 = getImageData("src/main/resources/images/womenTShirt.jpg");

        List<Image> womenTShirtImages = new ArrayList<>();
        womenTShirtImages.add(womenTShirtImage1);
        womenTShirtImages.add(womenTShirtImage2);
        womenTShirtImages.add(womenTShirtImage3);
        womenTShirtImages.add(womenTShirtImage4);

        Product womenTShort1 = new Product();
        womenTShort1.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateB = LocalDateTime.of(2021,3,5,0,0);
        womenTShort1.setEndDate(endDateB);
        LocalDateTime startDateB = LocalDateTime.of(2021,2,20,0,0);
        womenTShort1.setStartDate(startDateB);
        womenTShort1.setName("Black T-Shirt");
        womenTShort1.setStartPrice(50);

        womenTShirtImages.get(0).setProduct(womenTShort1);
        womenTShirtImages.get(1).setProduct(womenTShort1);
        womenTShirtImages.get(2).setProduct(womenTShort1);
        womenTShirtImages.get(3).setProduct(womenTShort1);

        womenTShort1.setImageList(womenTShirtImages);

        productRepository.save(womenTShort1);
        imageRepository.save(womenTShirtImage1);
        imageRepository.save(womenTShirtImage2);
        imageRepository.save(womenTShirtImage3);
        imageRepository.save(womenTShirtImage4);

        //
        Image womenRedTShirtImage1 = getImageData("src/main/resources/images/womenRedTShirt.jpg");
        Image womenRedTShirtImage2 = getImageData("src/main/resources/images/womenRedTShirt.jpg");
        Image womenRedTShirtImage3 = getImageData("src/main/resources/images/womenRedTShirt.jpg");
        Image womenRedTShirtImage4 = getImageData("src/main/resources/images/womenRedTShirt.jpg");

        List<Image> womenRedTShirtImages = new ArrayList<>();
        womenRedTShirtImages.add(womenRedTShirtImage1);
        womenRedTShirtImages.add(womenRedTShirtImage2);
        womenRedTShirtImages.add(womenRedTShirtImage3);
        womenRedTShirtImages.add(womenRedTShirtImage4);

        Product womenRedTShort = new Product();
        womenRedTShort.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateR = LocalDateTime.of(2021,3,28,0,0);
        womenRedTShort.setEndDate(endDateR);
        LocalDateTime startDateR = LocalDateTime.of(2021,3,2,0,0);
        womenRedTShort.setStartDate(startDateR);
        womenRedTShort.setName("Red T-Shirt");
        womenRedTShort.setStartPrice(60);

        womenRedTShirtImages.get(0).setProduct(womenRedTShort);
        womenRedTShirtImages.get(1).setProduct(womenRedTShort);
        womenRedTShirtImages.get(2).setProduct(womenRedTShort);
        womenRedTShirtImages.get(3).setProduct(womenRedTShort);

        womenRedTShort.setImageList(womenRedTShirtImages);

        productRepository.save(womenRedTShort);
        imageRepository.save(womenRedTShirtImage1);
        imageRepository.save(womenRedTShirtImage2);
        imageRepository.save(womenRedTShirtImage3);
        imageRepository.save(womenRedTShirtImage4);

        //
        Image womenWhiteTShirtImage1 = getImageData("src/main/resources/images/womenWhiteTShirt.jpg");
        Image womenWhiteTShirtImage2 = getImageData("src/main/resources/images/womenWhiteTShirt.jpg");
        Image womenWhiteTShirtImage3 = getImageData("src/main/resources/images/womenWhiteTShirt.jpg");
        Image womenWhiteTShirtImage4 = getImageData("src/main/resources/images/womenWhiteTShirt.jpg");

        List<Image> womenWhiteTShirtImages = new ArrayList<>();
        womenWhiteTShirtImages.add(womenWhiteTShirtImage1);
        womenWhiteTShirtImages.add(womenWhiteTShirtImage2);
        womenWhiteTShirtImages.add(womenWhiteTShirtImage3);
        womenWhiteTShirtImages.add(womenWhiteTShirtImage4);

        Product womenWhiteTShort = new Product();
        womenWhiteTShort.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateW = LocalDateTime.of(2021,3,5,0,0);
        womenWhiteTShort.setEndDate(endDateW);
        LocalDateTime startDateW = LocalDateTime.of(2021,2,27,0,0);
        womenWhiteTShort.setStartDate(startDateW);
        womenWhiteTShort.setName("White T-Shirt");
        womenWhiteTShort.setStartPrice(70);

        womenWhiteTShirtImages.get(0).setProduct(womenWhiteTShort);
        womenWhiteTShirtImages.get(1).setProduct(womenWhiteTShort);
        womenWhiteTShirtImages.get(2).setProduct(womenWhiteTShort);
        womenWhiteTShirtImages.get(3).setProduct(womenWhiteTShort);

        womenRedTShort.setImageList(womenWhiteTShirtImages);

        productRepository.save(womenWhiteTShort);
        imageRepository.save(womenWhiteTShirtImage1);
        imageRepository.save(womenWhiteTShirtImage2);
        imageRepository.save(womenWhiteTShirtImage3);
        imageRepository.save(womenWhiteTShirtImage4);


        List<Product> womenClothesProducts = new ArrayList<>();
        womenClothesProducts.add(womenTShort1);
        womenClothesProducts.add(womenRedTShort);
        womenClothesProducts.add(womenWhiteTShort);


        womenClothes.setProducts(womenClothesProducts);

        subcategoryRepository.save(womenClothes);


        //
        Subcategory womenShoes = new Subcategory();
        womenShoes.setName("Shoes");
        womenShoes.setCategory(women);
        subcategoryRepository.save(womenShoes);

        Image womenSneakersImg1 = getImageData("src/main/resources/images/Sneakers2.PNG");
        Image womenSneakersImg2 = getImageData("src/main/resources/images/Sneakers2.PNG");
        Image womenSneakersImg3 = getImageData("src/main/resources/images/Sneakers2.PNG");
        Image womenSneakersImg4 = getImageData("src/main/resources/images/Sneakers2.PNG");

        List<Image> womenSneakersImages = new ArrayList<>();
        womenSneakersImages.add(womenSneakersImg1);
        womenSneakersImages.add(womenSneakersImg2);
        womenSneakersImages.add(womenSneakersImg3);
        womenSneakersImages.add(womenSneakersImg4);

        Product womenSneakers = new Product();
        womenSneakers.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateS = LocalDateTime.of(2021,3,29,0,0);
        womenSneakers.setEndDate(endDateS);
        LocalDateTime startDateS = LocalDateTime.of(2021,3,1,0,0);
        womenSneakers.setStartDate(startDateS);
        womenSneakers.setName("Purple sneakers");
        womenSneakers.setStartPrice(200);

        womenSneakersImages.get(0).setProduct(womenSneakers);
        womenSneakersImages.get(1).setProduct(womenSneakers);
        womenSneakersImages.get(2).setProduct(womenSneakers);
        womenSneakersImages.get(3).setProduct(womenSneakers);

        womenSneakers.setImageList(womenSneakersImages);

        productRepository.save(womenSneakers);
        imageRepository.save(womenSneakersImg1);
        imageRepository.save(womenSneakersImg2);
        imageRepository.save(womenSneakersImg3);
        imageRepository.save(womenSneakersImg4);


        Image womenWhiteSneakersImg1 = getImageData("src/main/resources/images/womenWhiteSneakers.png");
        Image womenWhiteSneakersImg2 = getImageData("src/main/resources/images/womenWhiteSneakers.png");
        Image womenWhiteSneakersImg3 = getImageData("src/main/resources/images/womenWhiteSneakers.png");
        Image womenWhiteSneakersImg4 = getImageData("src/main/resources/images/womenWhiteSneakers.png");

        List<Image> womenWhiteSneakersImages = new ArrayList<>();
        womenWhiteSneakersImages.add(womenWhiteSneakersImg1);
        womenWhiteSneakersImages.add(womenWhiteSneakersImg2);
        womenWhiteSneakersImages.add(womenWhiteSneakersImg3);
        womenWhiteSneakersImages.add(womenWhiteSneakersImg4);

        Product womenWhiteSneakers = new Product();
        womenWhiteSneakers.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateWS = LocalDateTime.of(2021,3,29,0,0);
        womenWhiteSneakers.setEndDate(endDateWS);
        LocalDateTime startDateWS = LocalDateTime.of(2021,3,3,0,0);
        womenWhiteSneakers.setStartDate(startDateWS);
        womenWhiteSneakers.setName("Purple sneakers");
        womenWhiteSneakers.setStartPrice(150);

        womenWhiteSneakersImages.get(0).setProduct(womenWhiteSneakers);
        womenWhiteSneakersImages.get(1).setProduct(womenWhiteSneakers);
        womenWhiteSneakersImages.get(2).setProduct(womenWhiteSneakers);
        womenWhiteSneakersImages.get(3).setProduct(womenWhiteSneakers);

        womenWhiteSneakers.setImageList(womenWhiteSneakersImages);

        productRepository.save(womenWhiteSneakers);
        imageRepository.save(womenWhiteSneakersImg1);
        imageRepository.save(womenWhiteSneakersImg2);
        imageRepository.save(womenWhiteSneakersImg3);
        imageRepository.save(womenWhiteSneakersImg4);

        Image womenPinkSneakersImg1 = getImageData("src/main/resources/images/womenPinkSneakers.jpg");
        Image womenPinkSneakersImg2 = getImageData("src/main/resources/images/womenPinkSneakers.jpg");
        Image womenPinkSneakersImg3 = getImageData("src/main/resources/images/womenPinkSneakers.jpg");
        Image womenPinkSneakersImg4 = getImageData("src/main/resources/images/womenPinkSneakers.jpg");

        List<Image> womenPinkSneakersImages = new ArrayList<>();
        womenPinkSneakersImages.add(womenPinkSneakersImg1);
        womenPinkSneakersImages.add(womenPinkSneakersImg2);
        womenPinkSneakersImages.add(womenPinkSneakersImg3);
        womenPinkSneakersImages.add(womenPinkSneakersImg4);

        Product womenPinkSneakers = new Product();
        womenPinkSneakers.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateP = LocalDateTime.of(2021,3,29,0,0);
        womenPinkSneakers.setEndDate(endDateP);
        LocalDateTime startDateP = LocalDateTime.of(2021,3,3,0,0);
        womenPinkSneakers.setStartDate(startDateP);
        womenPinkSneakers.setName("Purple sneakers");
        womenPinkSneakers.setStartPrice(130);

        womenPinkSneakersImages.get(0).setProduct(womenPinkSneakers);
        womenPinkSneakersImages.get(1).setProduct(womenPinkSneakers);
        womenPinkSneakersImages.get(2).setProduct(womenPinkSneakers);
        womenPinkSneakersImages.get(3).setProduct(womenPinkSneakers);

        womenPinkSneakers.setImageList(womenPinkSneakersImages);

        productRepository.save(womenPinkSneakers);
        imageRepository.save(womenPinkSneakersImg1);
        imageRepository.save(womenPinkSneakersImg2);
        imageRepository.save(womenPinkSneakersImg3);
        imageRepository.save(womenPinkSneakersImg4);


        List<Product> womenShoesProducts = new ArrayList<>();
        womenShoesProducts.add(womenSneakers);
        womenShoesProducts.add(womenWhiteSneakers);
        womenShoesProducts.add(womenPinkSneakers);

        womenShoes.setProducts(womenShoesProducts);

        subcategoryRepository.save(womenShoes);

        //man
        Category man = new Category();
        man.setName("Man");
        categoryRepository.save(man);

        Subcategory manClothes = new Subcategory();
        manClothes.setName("Clothes");
        manClothes.setCategory(man);
        subcategoryRepository.save(manClothes);

        Image manWhiteTShirtImg1 = getImageData("src/main/resources/images/manWhiteTShirt.jpg");
        Image manWhiteTShirtImg2 = getImageData("src/main/resources/images/manWhiteTShirt.jpg");
        Image manWhiteTShirtImg3 = getImageData("src/main/resources/images/manWhiteTShirt.jpg");
        Image manWhiteTShirtImg4 = getImageData("src/main/resources/images/manWhiteTShirt.jpg");

        List<Image> manWhiteTShirtImages = new ArrayList<>();
        manWhiteTShirtImages.add(manWhiteTShirtImg1);
        manWhiteTShirtImages.add(manWhiteTShirtImg2);
        manWhiteTShirtImages.add(manWhiteTShirtImg3);
        manWhiteTShirtImages.add(manWhiteTShirtImg4);

        Product manWhiteTShirt = new Product();
        manWhiteTShirt.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateWt = LocalDateTime.of(2021,3,29,0,0);
        manWhiteTShirt.setEndDate(endDateWt);
        LocalDateTime startDateWt = LocalDateTime.of(2021,3,1,0,0);
        manWhiteTShirt.setStartDate(startDateWt);
        manWhiteTShirt.setName("T-Shirt");
        manWhiteTShirt.setStartPrice(100);

        manWhiteTShirtImages.get(0).setProduct(manWhiteTShirt);
        manWhiteTShirtImages.get(1).setProduct(manWhiteTShirt);
        manWhiteTShirtImages.get(2).setProduct(manWhiteTShirt);
        manWhiteTShirtImages.get(3).setProduct(manWhiteTShirt);

        manWhiteTShirt.setImageList(manWhiteTShirtImages);

        productRepository.save(manWhiteTShirt);
        imageRepository.save(manWhiteTShirtImg1);
        imageRepository.save(manWhiteTShirtImg2);
        imageRepository.save(manWhiteTShirtImg3);
        imageRepository.save(manWhiteTShirtImg4);


        Image manBlackShirtImg1 = getImageData("src/main/resources/images/manBlackShirt.jpg");
        Image manBlackShirtImg2 = getImageData("src/main/resources/images/manBlackShirt.jpg");
        Image manBlackShirtImg3 = getImageData("src/main/resources/images/manBlackShirt.jpg");
        Image manBlackShirtImg4 = getImageData("src/main/resources/images/manBlackShirt.jpg");

        List<Image> manBlackShirtImages = new ArrayList<>();
        manBlackShirtImages.add(manBlackShirtImg1);
        manBlackShirtImages.add(manBlackShirtImg2);
        manBlackShirtImages.add(manBlackShirtImg3);
        manBlackShirtImages.add(manBlackShirtImg4);

        Product manBlackShirt = new Product();
        manBlackShirt.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateBS = LocalDateTime.of(2021,3,29,0,0);
        manBlackShirt.setEndDate(endDateBS);
        LocalDateTime startDateBS = LocalDateTime.of(2021,3,1,0,0);
        manBlackShirt.setStartDate(startDateBS);
        manBlackShirt.setName("Black shirt");
        manBlackShirt.setStartPrice(170);

        manBlackShirtImages.get(0).setProduct(manBlackShirt);
        manBlackShirtImages.get(1).setProduct(manBlackShirt);
        manBlackShirtImages.get(2).setProduct(manBlackShirt);
        manBlackShirtImages.get(3).setProduct(manBlackShirt);

        manBlackShirt.setImageList(manBlackShirtImages);

        productRepository.save(manBlackShirt);
        imageRepository.save(manBlackShirtImg1);
        imageRepository.save(manBlackShirtImg2);
        imageRepository.save(manBlackShirtImg3);
        imageRepository.save(manBlackShirtImg4);


        Image manBlueShirtImg1 = getImageData("src/main/resources/images/manBlueShirt.jpg");
        Image manBlueShirtImg2 = getImageData("src/main/resources/images/manBlueShirt.jpg");
        Image manBlueShirtImg3 = getImageData("src/main/resources/images/manBlueShirt.jpg");
        Image manBlueShirtImg4 = getImageData("src/main/resources/images/manBlueShirt.jpg");

        List<Image> manBlueShirtImages = new ArrayList<>();
        manBlueShirtImages.add(manBlueShirtImg1);
        manBlueShirtImages.add(manBlueShirtImg2);
        manBlueShirtImages.add(manBlueShirtImg3);
        manBlueShirtImages.add(manBlueShirtImg4);

        Product manBlueShirt = new Product();
        manBlueShirt.setDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.");
        LocalDateTime endDateBs = LocalDateTime.of(2021,3,29,0,0);
        manBlueShirt.setEndDate(endDateBs);
        LocalDateTime startDateBs = LocalDateTime.of(2021,3,1,0,0);
        manBlueShirt.setStartDate(startDateBs);
        manBlueShirt.setName("Blue shirt");
        manBlueShirt.setStartPrice(155);

        manBlueShirtImages.get(0).setProduct(manBlueShirt);
        manBlueShirtImages.get(1).setProduct(manBlueShirt);
        manBlueShirtImages.get(2).setProduct(manBlueShirt);
        manBlueShirtImages.get(3).setProduct(manBlueShirt);

        manBlueShirt.setImageList(manBlueShirtImages);

        productRepository.save(manBlueShirt);
        imageRepository.save(manBlueShirtImg1);
        imageRepository.save(manBlueShirtImg2);
        imageRepository.save(manBlueShirtImg3);
        imageRepository.save(manBlueShirtImg4);


        List<Product> manClothesProducts = new ArrayList<>();
        manClothesProducts.add(manWhiteTShirt);
        manClothesProducts.add(manBlackShirt);
        manClothesProducts.add(manBlueShirt);

        manClothes.setProducts(manClothesProducts);

        subcategoryRepository.save(manClothes);

        Category kids = new Category();
        kids.setName("Kids");
        categoryRepository.save(kids);

        Category home = new Category();
        home.setName("Home");
        categoryRepository.save(home);

        Category art = new Category();
        art.setName("Art");
        categoryRepository.save(art);

        Category computers = new Category();
        computers.setName("Computers");
        categoryRepository.save(computers);

        Category mobile = new Category();
        mobile.setName("Mobile");
        categoryRepository.save(mobile);

        Category electronics = new Category();
        electronics.setName("Electronics");
        categoryRepository.save(electronics);

        Category sportware = new Category();
        sportware.setName("Sportware");
        categoryRepository.save(sportware);

    }
}

