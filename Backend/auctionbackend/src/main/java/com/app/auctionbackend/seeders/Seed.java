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

    @Autowired
    BidRepository bidRepository;

    @Autowired
    GenderRepository genderRepository;

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

    private void seedProductImage(Integer id, List<String> imagePaths){
        Product product = productRepository.findById(id).orElse(null);
        if(product != null){
            Image productImage1 = getImageData(imagePaths.get(0));
            Image productImage2 = getImageData(imagePaths.get(1));
            Image productImage3 = getImageData(imagePaths.get(2));
            Image productImage4 = getImageData(imagePaths.get(3));
            Image productImage5 = getImageData(imagePaths.get(4));

            List<Image> productImages = new ArrayList<>();
            productImages.add(productImage1);
            productImages.add(productImage2);
            productImages.add(productImage3);
            productImages.add(productImage4);
            productImages.add(productImage5);

            productImages.get(0).setProduct(product);
            productImages.get(1).setProduct(product);
            productImages.get(2).setProduct(product);
            productImages.get(3).setProduct(product);
            productImages.get(4).setProduct(product);

            product.setImageList(productImages);

            productRepository.save(product);
            imageRepository.save(productImage1);
            imageRepository.save(productImage2);
            imageRepository.save(productImage3);
            imageRepository.save(productImage4);
            imageRepository.save(productImage5);
        }
    }

    @EventListener
    public void seed(ContextRefreshedEvent event) {
///
        Customer customer = customerRepository.findById(1).orElse(null);
        Customer customer1 = customerRepository.findById(5).orElse(null);

        Product p = new Product();
        p.setName("Yellow Sneakers");
        p.setPaid(false);
        p.setCustomer(customer);
        p.setEndDate(LocalDateTime.now());
        p.setStartDate(LocalDateTime.of(2021, 4,5,0,0));
        p.setDescription("Men yellow sneakers");
        p.setStartPrice(120);
        p.setModifiedOn(LocalDateTime.now());
        p.setCreatedOn(LocalDateTime.now());

        productRepository.save(p);

        Bid bid = new Bid();
        bid.setCustomer(customer1);
        bid.setDateOfBidPlacement(LocalDateTime.of(2021, 4, 6, 0,0));
        bid.setBidPrice(125);
        bid.setProduct(p);

        bidRepository.save(bid);
///
        List<Image> images = imageRepository.findAll();
        if(images != null && images.size() > 0)
            return;

        List<String> imagePaths = new ArrayList<>();
        imagePaths.add("src/main/resources/images/womenTShirt.jpg");
        imagePaths.add("src/main/resources/images/womenTShirt.jpg");
        imagePaths.add("src/main/resources/images/womenTShirt.jpg");
        imagePaths.add("src/main/resources/images/womenTShirt.jpg");
        imagePaths.add("src/main/resources/images/womenTShirt.jpg");
        seedProductImage(1, imagePaths);

        List<String> p2ImagePaths = new ArrayList<>();
        p2ImagePaths.add("src/main/resources/images/womenRedTShirt.jpg");
        p2ImagePaths.add("src/main/resources/images/womenRedTShirt2.jpg");
        p2ImagePaths.add("src/main/resources/images/womenRedTShirt3.jpg");
        p2ImagePaths.add("src/main/resources/images/womenRedTShirt4.jpg");
        p2ImagePaths.add("src/main/resources/images/womenRedTShirt5.jpg");
        seedProductImage(2, p2ImagePaths);

        List<String> p3ImagePaths = new ArrayList<>();
        p3ImagePaths.add("src/main/resources/images/womenWhiteShirt2.jpg");
        p3ImagePaths.add("src/main/resources/images/womenWhiteTShirt.jpg");
        p3ImagePaths.add("src/main/resources/images/womenWhiteShirt3.jpg");
        p3ImagePaths.add("src/main/resources/images/womenWhiteShirt4.jpg");
        p3ImagePaths.add("src/main/resources/images/womenWhiteShirt5.jpg");
        seedProductImage(3, p3ImagePaths);

        List<String> p4ImagePaths = new ArrayList<>();
        p4ImagePaths.add("src/main/resources/images/purpleSneakers.png");
        p4ImagePaths.add("src/main/resources/images/purpleSneakers.png");
        p4ImagePaths.add("src/main/resources/images/purpleSneakers.png");
        p4ImagePaths.add("src/main/resources/images/purpleSneakers.png");
        p4ImagePaths.add("src/main/resources/images/purpleSneakers.png");
        seedProductImage(4, p4ImagePaths);

        List<String> p5ImagePaths = new ArrayList<>();
        p5ImagePaths.add("src/main/resources/images/womenWhiteSneakers.png");
        p5ImagePaths.add("src/main/resources/images/womenWhiteSneakers.png");
        p5ImagePaths.add("src/main/resources/images/womenWhiteSneakers.png");
        p5ImagePaths.add("src/main/resources/images/womenWhiteSneakers.png");
        p5ImagePaths.add("src/main/resources/images/womenWhiteSneakers.png");
        seedProductImage(5, p5ImagePaths);

        List<String> p6ImagePaths = new ArrayList<>();
        p6ImagePaths.add("src/main/resources/images/womenPinkSneakers.jpg");
        p6ImagePaths.add("src/main/resources/images/womenPinkSneakers.jpg");
        p6ImagePaths.add("src/main/resources/images/womenPinkSneakers.jpg");
        p6ImagePaths.add("src/main/resources/images/womenPinkSneakers.jpg");
        p6ImagePaths.add("src/main/resources/images/womenPinkSneakers.jpg");
        seedProductImage(6, p6ImagePaths);

        List<String> p7ImagePaths = new ArrayList<>();
        p7ImagePaths.add("src/main/resources/images/womenRedBag.jpg");
        p7ImagePaths.add("src/main/resources/images/womenRedBag.jpg");
        p7ImagePaths.add("src/main/resources/images/womenRedBag.jpg");
        p7ImagePaths.add("src/main/resources/images/womenRedBag.jpg");
        p7ImagePaths.add("src/main/resources/images/womenRedBag.jpg");
        seedProductImage(7, p7ImagePaths);

        List<String> p8ImagePaths = new ArrayList<>();
        p8ImagePaths.add("src/main/resources/images/womenCamelBag.jpg");
        p8ImagePaths.add("src/main/resources/images/womenCamelBag.jpg");
        p8ImagePaths.add("src/main/resources/images/womenCamelBag.jpg");
        p8ImagePaths.add("src/main/resources/images/womenCamelBag.jpg");
        p8ImagePaths.add("src/main/resources/images/womenCamelBag.jpg");
        seedProductImage(8, p8ImagePaths);

        List<String> p9ImagePaths = new ArrayList<>();
        p9ImagePaths.add("src/main/resources/images/womenBlackBag.jpg");
        p9ImagePaths.add("src/main/resources/images/womenBlackBag.jpg");
        p9ImagePaths.add("src/main/resources/images/womenBlackBag.jpg");
        p9ImagePaths.add("src/main/resources/images/womenBlackBag.jpg");
        p9ImagePaths.add("src/main/resources/images/womenBlackBag.jpg");
        seedProductImage(9, p9ImagePaths);

        List<String> p10ImagePaths = new ArrayList<>();
        p10ImagePaths.add("src/main/resources/images/womenBeigeBag.jpg");
        p10ImagePaths.add("src/main/resources/images/womenBeigeBag.jpg");
        p10ImagePaths.add("src/main/resources/images/womenBeigeBag.jpg");
        p10ImagePaths.add("src/main/resources/images/womenBeigeBag.jpg");
        p10ImagePaths.add("src/main/resources/images/womenBeigeBag.jpg");
        seedProductImage(10, p10ImagePaths);

        List<String> p11ImagePaths = new ArrayList<>();
        p11ImagePaths.add("src/main/resources/images/manWhiteTShirt.jpg");
        p11ImagePaths.add("src/main/resources/images/manWhiteTShirt.jpg");
        p11ImagePaths.add("src/main/resources/images/manWhiteTShirt.jpg");
        p11ImagePaths.add("src/main/resources/images/manWhiteTShirt.jpg");
        p11ImagePaths.add("src/main/resources/images/manWhiteTShirt.jpg");
        seedProductImage(11, p11ImagePaths);

        List<String> p12ImagePaths = new ArrayList<>();
        p12ImagePaths.add("src/main/resources/images/manBlackShirt.jpg");
        p12ImagePaths.add("src/main/resources/images/manBlackShirt.jpg");
        p12ImagePaths.add("src/main/resources/images/manBlackShirt.jpg");
        p12ImagePaths.add("src/main/resources/images/manBlackShirt.jpg");
        p12ImagePaths.add("src/main/resources/images/manBlackShirt.jpg");
        seedProductImage(12, p12ImagePaths);

        List<String> p13ImagePaths = new ArrayList<>();
        p13ImagePaths.add("src/main/resources/images/manBlueShirt.jpg");
        p13ImagePaths.add("src/main/resources/images/manBlueShirt.jpg");
        p13ImagePaths.add("src/main/resources/images/manBlueShirt.jpg");
        p13ImagePaths.add("src/main/resources/images/manBlueShirt.jpg");
        p13ImagePaths.add("src/main/resources/images/manBlueShirt.jpg");
        seedProductImage(13, p13ImagePaths);

        List<String> p14ImagePaths = new ArrayList<>();
        p14ImagePaths.add("src/main/resources/images/manBlackSneakers.jpg");
        p14ImagePaths.add("src/main/resources/images/manBlackSneakers.jpg");
        p14ImagePaths.add("src/main/resources/images/manBlackSneakers.jpg");
        p14ImagePaths.add("src/main/resources/images/manBlackSneakers.jpg");
        p14ImagePaths.add("src/main/resources/images/manBlackSneakers.jpg");
        seedProductImage(14, p14ImagePaths);

        List<String> p15ImagePaths = new ArrayList<>();
        p15ImagePaths.add("src/main/resources/images/manGreySneakers.jpg");
        p15ImagePaths.add("src/main/resources/images/manGreySneakers.jpg");
        p15ImagePaths.add("src/main/resources/images/manGreySneakers.jpg");
        p15ImagePaths.add("src/main/resources/images/manGreySneakers.jpg");
        p15ImagePaths.add("src/main/resources/images/manGreySneakers.jpg");
        seedProductImage(15, p15ImagePaths);

        List<String> p16ImagePaths = new ArrayList<>();
        p16ImagePaths.add("src/main/resources/images/manOrangeSneakers.jpg");
        p16ImagePaths.add("src/main/resources/images/manOrangeSneakers.jpg");
        p16ImagePaths.add("src/main/resources/images/manOrangeSneakers.jpg");
        p16ImagePaths.add("src/main/resources/images/manOrangeSneakers.jpg");
        p16ImagePaths.add("src/main/resources/images/manOrangeSneakers.jpg");
        seedProductImage(16, p16ImagePaths);

        List<String> p17ImagePaths = new ArrayList<>();
        p17ImagePaths.add("src/main/resources/images/kidsNavyTShirt.jpg");
        p17ImagePaths.add("src/main/resources/images/kidsNavyTShirt.jpg");
        p17ImagePaths.add("src/main/resources/images/kidsNavyTShirt.jpg");
        p17ImagePaths.add("src/main/resources/images/kidsNavyTShirt.jpg");
        p17ImagePaths.add("src/main/resources/images/kidsNavyTShirt.jpg");
        seedProductImage(17, p17ImagePaths);

        List<String> p18ImagePaths = new ArrayList<>();
        p18ImagePaths.add("src/main/resources/images/kidsBlueTShirt.jpg");
        p18ImagePaths.add("src/main/resources/images/kidsBlueTShirt.jpg");
        p18ImagePaths.add("src/main/resources/images/kidsBlueTShirt.jpg");
        p18ImagePaths.add("src/main/resources/images/kidsBlueTShirt.jpg");
        p18ImagePaths.add("src/main/resources/images/kidsBlueTShirt.jpg");
        seedProductImage(18, p18ImagePaths);

        List<String> p19ImagePaths = new ArrayList<>();
        p19ImagePaths.add("src/main/resources/images/homeDecorationCloud.jpg");
        p19ImagePaths.add("src/main/resources/images/homeDecorationCloud.jpg");
        p19ImagePaths.add("src/main/resources/images/homeDecorationCloud.jpg");
        p19ImagePaths.add("src/main/resources/images/homeDecorationCloud.jpg");
        p19ImagePaths.add("src/main/resources/images/homeDecorationCloud.jpg");
        seedProductImage(19, p19ImagePaths);

        List<String> p20ImagePaths = new ArrayList<>();
        p20ImagePaths.add("src/main/resources/images/homeDecorationCandlestick.jpg");
        p20ImagePaths.add("src/main/resources/images/homeDecorationCandlestick.jpg");
        p20ImagePaths.add("src/main/resources/images/homeDecorationCandlestick.jpg");
        p20ImagePaths.add("src/main/resources/images/homeDecorationCandlestick.jpg");
        p20ImagePaths.add("src/main/resources/images/homeDecorationCandlestick.jpg");
        seedProductImage(20, p20ImagePaths);

        List<String> p21ImagePaths = new ArrayList<>();
        p21ImagePaths.add("src/main/resources/images/artPainting1.jpg");
        p21ImagePaths.add("src/main/resources/images/artPainting1.jpg");
        p21ImagePaths.add("src/main/resources/images/artPainting1.jpg");
        p21ImagePaths.add("src/main/resources/images/artPainting1.jpg");
        p21ImagePaths.add("src/main/resources/images/artPainting1.jpg");
        seedProductImage(21, p21ImagePaths);

        List<String> p22ImagePaths = new ArrayList<>();
        p22ImagePaths.add("src/main/resources/images/computer1.jpg");
        p22ImagePaths.add("src/main/resources/images/computer1.jpg");
        p22ImagePaths.add("src/main/resources/images/computer1.jpg");
        p22ImagePaths.add("src/main/resources/images/computer1.jpg");
        p22ImagePaths.add("src/main/resources/images/computer1.jpg");
        seedProductImage(22, p22ImagePaths);

        List<String> p23ImagePaths = new ArrayList<>();
        p23ImagePaths.add("src/main/resources/images/mobilePhone1.jpg");
        p23ImagePaths.add("src/main/resources/images/mobilePhone1.jpg");
        p23ImagePaths.add("src/main/resources/images/mobilePhone1.jpg");
        p23ImagePaths.add("src/main/resources/images/mobilePhone1.jpg");
        p23ImagePaths.add("src/main/resources/images/mobilePhone1.jpg");
        seedProductImage(23, p23ImagePaths);

        List<String> p24ImagePaths = new ArrayList<>();
        p24ImagePaths.add("src/main/resources/images/mobileCase1.jpg");
        p24ImagePaths.add("src/main/resources/images/mobileCase1.jpg");
        p24ImagePaths.add("src/main/resources/images/mobileCase1.jpg");
        p24ImagePaths.add("src/main/resources/images/mobileCase1.jpg");
        p24ImagePaths.add("src/main/resources/images/mobileCase1.jpg");
        seedProductImage(24, p24ImagePaths);

        List<String> p25ImagePaths = new ArrayList<>();
        p25ImagePaths.add("src/main/resources/images/vacuumCleaner.png");
        p25ImagePaths.add("src/main/resources/images/vacuumCleaner.png");
        p25ImagePaths.add("src/main/resources/images/vacuumCleaner.png");
        p25ImagePaths.add("src/main/resources/images/vacuumCleaner.png");
        p25ImagePaths.add("src/main/resources/images/vacuumCleaner.png");
        seedProductImage(25, p25ImagePaths);

        List<String> p26ImagePaths = new ArrayList<>();
        p26ImagePaths.add("src/main/resources/images/robotVacuumCleaner.jpg");
        p26ImagePaths.add("src/main/resources/images/robotVacuumCleaner.jpg");
        p26ImagePaths.add("src/main/resources/images/robotVacuumCleaner.jpg");
        p26ImagePaths.add("src/main/resources/images/robotVacuumCleaner.jpg");
        p26ImagePaths.add("src/main/resources/images/robotVacuumCleaner.jpg");
        seedProductImage(26, p26ImagePaths);

        List<String> p27ImagePaths = new ArrayList<>();
        p27ImagePaths.add("src/main/resources/images/football.jpg");
        p27ImagePaths.add("src/main/resources/images/football.jpg");
        p27ImagePaths.add("src/main/resources/images/football.jpg");
        p27ImagePaths.add("src/main/resources/images/football.jpg");
        p27ImagePaths.add("src/main/resources/images/football.jpg");
        seedProductImage(27, p27ImagePaths);

        List<String> p28ImagePaths = new ArrayList<>();
        p28ImagePaths.add("src/main/resources/images/basketball.jpg");
        p28ImagePaths.add("src/main/resources/images/basketball.jpg");
        p28ImagePaths.add("src/main/resources/images/basketball.jpg");
        p28ImagePaths.add("src/main/resources/images/basketball.jpg");
        p28ImagePaths.add("src/main/resources/images/basketball.jpg");
        seedProductImage(28, p28ImagePaths);

        List<String> p29ImagePaths = new ArrayList<>();
        p29ImagePaths.add("src/main/resources/images/mascaraImage1.jpg");
        p29ImagePaths.add("src/main/resources/images/mascaraImage1.jpg");
        p29ImagePaths.add("src/main/resources/images/mascaraImage1.jpg");
        p29ImagePaths.add("src/main/resources/images/mascaraImage1.jpg");
        p29ImagePaths.add("src/main/resources/images/mascaraImage1.jpg");
        seedProductImage(29, p29ImagePaths);

        List<String> p30ImagePaths = new ArrayList<>();
        p30ImagePaths.add("src/main/resources/images/bronzerImage.jpg");
        p30ImagePaths.add("src/main/resources/images/bronzerImage.jpg");
        p30ImagePaths.add("src/main/resources/images/bronzerImage.jpg");
        p30ImagePaths.add("src/main/resources/images/bronzerImage.jpg");
        p30ImagePaths.add("src/main/resources/images/bronzerImage.jpg");
        seedProductImage(30, p30ImagePaths);
    }
}

