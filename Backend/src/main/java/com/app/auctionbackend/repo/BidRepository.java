package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Integer> {
    List<Bid> findByProductIdOrderByBidPrice(Integer productId);
    List<Bid> findByCustomerIdOrderByBidPrice(Integer customerId);
}
