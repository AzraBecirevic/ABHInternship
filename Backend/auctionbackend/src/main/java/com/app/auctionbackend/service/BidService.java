package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.BidDto;
import com.app.auctionbackend.dtos.PlaceBidDto;
import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.model.Customer;
import com.app.auctionbackend.model.Product;
import com.app.auctionbackend.repo.BidRepository;
import com.app.auctionbackend.repo.CustomerRepository;
import com.app.auctionbackend.repo.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.app.auctionbackend.helper.ValidationConstants.BID_MAX_PRICE;

@Service("bidService")
public class BidService {

    @Autowired
    BidRepository bidRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CustomerRepository customerRepository;

    DecimalFormat df = new DecimalFormat("#0.00");

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
            bidDto.setBidPriceText(df.format(bidDto.getBidPrice()));
            bidDtoList.add(bidDto);
        }
        bidDtoList.get(bidDtoList.size()-1).setHighestBid(true);
        return bidDtoList;
    }

    private Boolean modifyUserBid(Bid bid, PlaceBidDto placeBidDto){
        bid.setDateOfBidPlacement(LocalDateTime.now());
        bid.setBidPrice(placeBidDto.getBidPrice());
        bidRepository.save(bid);
        return true;
    }

    public Boolean addBid(PlaceBidDto placeBidDto){
        if(placeBidDto.getBidPrice() > BID_MAX_PRICE)
            return false;

         List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(placeBidDto.getProductId());

        if(bidList != null && bidList.size() > 0){
            if(bidList.get(bidList.size()-1).getBidPrice() > placeBidDto.getBidPrice()){
                 return  false;
            }
            for (Bid bid:bidList) {
                 if(bid.getCustomer().getEmail().equals(placeBidDto.getCustomerEmail())){
                   return modifyUserBid(bid, placeBidDto);
                 }
             }
         }
         Bid newBid = new Bid();

         Product product = productRepository.findById(placeBidDto.getProductId()).orElse(null);
         Customer customer = customerRepository.findByEmail(placeBidDto.getCustomerEmail());
         if(product == null || customer == null)
             return false;

         if(product.getStartPrice() > placeBidDto.getBidPrice())
             return false;

         newBid.setProduct(product);
         newBid.setCustomer(customer);
         newBid.setBidPrice(placeBidDto.getBidPrice());
         newBid.setDateOfBidPlacement(LocalDateTime.now());

         bidRepository.save(newBid);

         return true;
    }

}
