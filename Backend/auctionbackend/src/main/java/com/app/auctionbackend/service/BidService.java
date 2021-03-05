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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service("bidService")
public class BidService {

    @Autowired
    BidRepository bidRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CustomerRepository customerRepository;

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

    public Boolean addBidd(PlaceBidDto placeBidDto){
         List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(placeBidDto.getProductId());

        if(bidList != null && bidList.size() > 0){
            // ako ima jos bid-ova za taj proizvod onda bidPrice mora biti veci najveceg bid-a
             if(bidList.get(bidList.size()-1).getBidPrice() > placeBidDto.getBidPrice()){
                 return  false;
             }
            for (Bid bid:bidList) {
                 if(bid.getCustomer().getEmail().equals(placeBidDto.getCustomerEmail())){
                     // customer je vec napravio bid, mijenja se cijena i datum
                     bid.setDateOfBidPlacement(LocalDateTime.now());
                     bid.setBidPrice(placeBidDto.getBidPrice());
                     bidRepository.save(bid);
                     return true;
                 }
             }
         }
         Bid newBid = new Bid();

         Product product = productRepository.findById(placeBidDto.getProductId()).orElse(null);
         Customer customer = customerRepository.findByEmail(placeBidDto.getCustomerEmail());
         if(product == null || customer == null)
             return false;

         // ako je ovo prvi bid za taj proizvod, onda cijena moze biti jednaka startPrice-u
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
