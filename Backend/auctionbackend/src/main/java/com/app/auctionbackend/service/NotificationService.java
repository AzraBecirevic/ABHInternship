package com.app.auctionbackend.service;

import com.app.auctionbackend.firebase.NotificationRequest;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.Notification;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.repo.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service("notificationService")
public class NotificationService {

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    PushNotificationService pushNotificationService;

    public Notification saveNotification(Customer customer, String text, String  heading){
        Notification notification = new Notification();
        notification.setCustomer(customer);
        notification.setHeading(heading);
        notification.setText(text);
        notification.setSeen(false);
        notification.setSendingDate(LocalDateTime.now());
        notificationRepository.save(notification);
        return notification;
    }

    private String makeOutbidNotificationMessage(String message, String productName){
        String notificationMessage = new StringBuilder()
                .append(message)
                .append(productName)
                .append(".").toString();
        return notificationMessage;
    }
    private String makeAuctionDoneNotificationMessage(String messagePrefix, String productName, String messageSuffix){
        String notificationMessage = new StringBuilder()
                .append(messagePrefix)
                .append(productName)
                .append(messageSuffix)
                .toString();
        return notificationMessage;
    }

    public void sendNotificationToLastHighestBidder(Customer previousHighestBidder, Product product){
        String message = makeOutbidNotificationMessage("There is higher bid than yours for product ", product.getName());
        String title = "Your bid has been outbid";

        NotificationRequest notificationRequest = new NotificationRequest();
        notificationRequest.setTitle(title);
        notificationRequest.setMessage(message);
        notificationRequest.setToken(previousHighestBidder.getNotificationToken().getToken());

        saveNotification(previousHighestBidder, message, title);

        pushNotificationService.sendPushNotificationToToken(notificationRequest);
    }
    public void sendNotificationToProductHighestBidder(Customer highestBidder, Product product){
        String message = makeAuctionDoneNotificationMessage(" Congratulations, you are the biggest bidder for the product", product.getName(),", whose auction is over. You can pay for the product within 30 days." );
        String title = "Product auction is over";

        NotificationRequest notificationRequest = new NotificationRequest();
        notificationRequest.setTitle(title);
        notificationRequest.setMessage(message);
        notificationRequest.setToken(highestBidder.getNotificationToken().getToken());

        saveNotification(highestBidder, message, title);

        pushNotificationService.sendPushNotificationToToken(notificationRequest);
    }
}
