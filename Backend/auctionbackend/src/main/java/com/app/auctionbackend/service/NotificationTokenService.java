package com.app.auctionbackend.service;

import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.NotificationToken;
import com.app.auctionbackend.repo.NotificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("notificationTokenService")
public class NotificationTokenService {

    @Autowired
    NotificationTokenRepository notificationTokenRepository;

    public NotificationToken saveToken(String token, Customer customer){
        List<NotificationToken> notificationTokens = notificationTokenRepository.findAll();
        for (NotificationToken notificationToken: notificationTokens) {
            if(notificationToken.getCustomer().getId().equals(customer.getId())){
                notificationToken.setToken(token);
                notificationTokenRepository.save(notificationToken);
                return notificationToken;
            }
        }

        NotificationToken notificationToken = new NotificationToken();
        notificationToken.setCustomer(customer);
        notificationToken.setToken(token);
        notificationTokenRepository.save(notificationToken);
        return notificationToken;
    }
}
