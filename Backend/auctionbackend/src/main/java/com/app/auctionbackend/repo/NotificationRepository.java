package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByCustomerId(Integer customerId);
}
