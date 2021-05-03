package com.app.auctionbackend.service;

import com.app.auctionbackend.firebase.FCMService;
import com.app.auctionbackend.firebase.NotificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class PushNotificationService {

    @Autowired
    FCMService fcmService;

    public void sendPushNotificationToToken(NotificationRequest request) {
        try {
            fcmService.sendMessageToToken(request);
        } catch (InterruptedException | ExecutionException e) {
            System.out.println(e.getMessage());
        }
    }
}
