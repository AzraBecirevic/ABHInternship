package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.BidDto;
import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.repo.BidRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("bidService")
public class BidService {

    @Autowired
    BidRepository bidRepository;

    public List<BidDto> getBidsByProductId(Integer productId){
        List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(productId);

        List<BidDto> bidDtoList = new ArrayList<>();
        if(bidList == null || bidList.size() == 0)
            return bidDtoList;

        ModelMapper modelMapper = new ModelMapper();
        for (Bid bid: bidList) {
            BidDto bidDto = modelMapper.map(bid, BidDto.class);
            String customerFullName = bid.getCustomer().getFirstName() + " " +bid.getCustomer().getLastName();
            bidDto.setCustomerFullName(customerFullName);
            bidDtoList.add(bidDto);
        }
        bidDtoList.get(bidDtoList.size()-1).setHighestBid(true);
        return bidDtoList;
    }

}
