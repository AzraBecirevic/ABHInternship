package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.State;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateRepository extends JpaRepository<State, Integer> {
}
