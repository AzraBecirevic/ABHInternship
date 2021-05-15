package com.app.auctionbackend.service;

import com.app.auctionbackend.model.ZipCode;
import com.app.auctionbackend.repo.ZipCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("zipCodeService")
public class ZipCodeService {

    @Autowired
    private ZipCodeRepository zipCodeRepository;

    ZipCode saveZipCode(String zipCode){
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();

        for (ZipCode z : zipCodeList) {
            if(z.getZipCode().equals(zipCode)){
                return z;
            }
        }
        ZipCode zipCodeEntity = new ZipCode();
        zipCodeEntity.setZipCode(zipCode);
        zipCodeRepository.save(zipCodeEntity);
        return zipCodeEntity;
    }
}
