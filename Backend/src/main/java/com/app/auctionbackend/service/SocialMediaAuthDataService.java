package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.SocialMediaAuthDto;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.SocialMediaAuthData;
import com.app.auctionbackend.repo.SocialMediaAuthDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("socialMediaAuthDataService")
public class SocialMediaAuthDataService {

    @Autowired
    SocialMediaAuthDataRepository socialMediaAuthDataRepository;

    public void setCustomerSocialMediaAuthData(SocialMediaAuthDto socialMediaAuthDto, Customer customer){
        SocialMediaAuthData socialMediaAuthData = new SocialMediaAuthData();
        socialMediaAuthData.setProvider(socialMediaAuthDto.getProvider());
        socialMediaAuthData.setProviderId(socialMediaAuthDto.getProviderId());
        socialMediaAuthData.setAccessToken(socialMediaAuthDto.getAccessToken());
        socialMediaAuthData.setCustomer(customer);

        socialMediaAuthDataRepository.save(socialMediaAuthData);
    }

    public void updateCustomerSocialMediaAuthData(SocialMediaAuthDto socialMediaAuthDto, Customer customer){
        List<SocialMediaAuthData> socialMediaAuthDataList = socialMediaAuthDataRepository.findByCustomerId(customer.getId());

        if(socialMediaAuthDataList != null && !socialMediaAuthDataList.isEmpty()){
            SocialMediaAuthData socialMediaAuthData = socialMediaAuthDataList.get(0);
            socialMediaAuthData.setProvider(socialMediaAuthDto.getProvider());
            socialMediaAuthData.setProviderId(socialMediaAuthDto.getProviderId());
            socialMediaAuthData.setAccessToken(socialMediaAuthDto.getAccessToken());

            socialMediaAuthDataRepository.save(socialMediaAuthData);
        }
    }

}
