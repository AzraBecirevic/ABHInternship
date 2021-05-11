package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.NotificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationTokenRepository extends JpaRepository<NotificationToken, Integer> {
}
