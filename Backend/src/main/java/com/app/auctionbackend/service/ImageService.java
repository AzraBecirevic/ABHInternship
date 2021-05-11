package com.app.auctionbackend.service;

import com.app.auctionbackend.model.Image;
import com.app.auctionbackend.repo.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("imageService")
public class ImageService {

    @Autowired
    ImageRepository imageRepository;

    public Image saveImage(Image image){
        Image image1 = imageRepository.save(image);
        return image1;
    }
}
