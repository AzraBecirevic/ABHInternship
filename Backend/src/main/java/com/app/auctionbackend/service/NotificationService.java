package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.NotificationDto;
import com.app.auctionbackend.firebase.NotificationRequest;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.Notification;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.repo.NotificationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
        if(previousHighestBidder.getNotificationToken() != null && previousHighestBidder.getNotificationToken().getToken() != null) {
            String message = makeOutbidNotificationMessage("There is higher bid than yours for product ", product.getName());
            String title = "Your bid has been outbid";

            NotificationRequest notificationRequest = new NotificationRequest();
            notificationRequest.setTitle(title);
            notificationRequest.setMessage(message);
            notificationRequest.setToken(previousHighestBidder.getNotificationToken().getToken());

            saveNotification(previousHighestBidder, message, title);

            pushNotificationService.sendPushNotificationToToken(notificationRequest);
        }
    }

    public void sendNotificationToProductHighestBidder(Customer highestBidder, Product product){
        if(highestBidder.getNotificationToken() != null && highestBidder.getNotificationToken().getToken() != null) {
            String message = makeAuctionDoneNotificationMessage(" Congratulations, you are the biggest bidder for the product ", product.getName(), ", whose auction is over. You can pay for the product within 30 days.");
            String title = "Product auction is over";

            NotificationRequest notificationRequest = new NotificationRequest();
            notificationRequest.setTitle(title);
            notificationRequest.setMessage(message);
            notificationRequest.setToken(highestBidder.getNotificationToken().getToken());

            saveNotification(highestBidder, message, title);

            pushNotificationService.sendPushNotificationToToken(notificationRequest);
        }
    }

    public List<NotificationDto> getUnreadNotifications(Customer customer){
        List<Notification> notifications = notificationRepository.findByCustomerId(customer.getId());

        if(notifications == null || notifications.size() == 0)
            return null;

        List<NotificationDto> unreadNotifications = new ArrayList<>();
        ModelMapper modelMapper = new ModelMapper();

        for (Notification n : notifications) {
            if(!n.getSeen()){
                NotificationDto notificationDto = modelMapper.map(n, NotificationDto.class);
                unreadNotifications.add(notificationDto);
            }
        }
        return unreadNotifications;
    }

    public void setAllCustomersNotificationToRead(Customer customer){
        List<Notification> notifications = notificationRepository.findByCustomerId(customer.getId());

        if(notifications != null || notifications.size() > 0){
            for (Notification n : notifications) {
                if(!n.getSeen()){
                    n.setSeen(true);
                    notificationRepository.save(n);
                }
            }
        }
    }

    public Boolean setSingleCustomerNotificationToRead(Customer customer, Integer notificationId){
        Notification notification = notificationRepository.findById(notificationId).orElse(null);

        if(notification == null)
            return false;

        if(notification.getCustomer() == null || !notification.getCustomer().getId().equals(customer.getId())){
            return false;
        }

        notification.setSeen(true);
        notificationRepository.save(notification);
        return true;
    }
}
