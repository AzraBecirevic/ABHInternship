package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.AddedBidDto;
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
import static com.app.auctionbackend.helper.ValidationMessageConstants.*;

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

   private void modifyUserBid(Bid bid, PlaceBidDto placeBidDto){
       bid.setDateOfBidPlacement(LocalDateTime.now());
       bid.setBidPrice(placeBidDto.getBidPrice());
       bidRepository.save(bid);
   }

    public AddedBidDto addBid(PlaceBidDto placeBidDto){
        AddedBidDto addedBidDto = new AddedBidDto();

        if(placeBidDto.getBidPrice() > BID_MAX_PRICE){
            addedBidDto.setBidAdded(false);
            addedBidDto.setMessage(BID_MAX_ALLOWED_PRICE_MESSAGE);
            return addedBidDto;
        }

        Product product = productRepository.findById(placeBidDto.getProductId()).orElse(null);
        Customer customer = customerRepository.findByEmail(placeBidDto.getCustomerEmail());

        if(product == null || customer == null){
            addedBidDto.setBidAdded(false);
            addedBidDto.setMessage(BID_NOT_THERE_CUSTOMER_NOT_ALLOWED_MESSAGE);
            return addedBidDto;
        }

        if(customer.getId() == product.getCustomer().getId()){
            addedBidDto.setBidAdded(false);
            addedBidDto.setMessage(CUSTOMER_CAN_NOT_BID_PRODUCT);
            return addedBidDto;
        }

        List<Bid> bidList = bidRepository.findByProductIdOrderByBidPrice(placeBidDto.getProductId());

        if(bidList != null && bidList.size() > 0){
            if(bidList.get(bidList.size()-1).getBidPrice() >= placeBidDto.getBidPrice()){
                addedBidDto.setBidAdded(false);
                addedBidDto.setMessage(BID_MUST_BE_BIGGER_THAN_HIGHEST_MESSAGE);
                return addedBidDto;
            }
            for (Bid bid:bidList) {
                if(bid.getCustomer().getEmail().equals(placeBidDto.getCustomerEmail())){
                    if(bid.getBidPrice() == bidList.get(bidList.size()-1).getBidPrice()){
                        addedBidDto.setBidAdded(false);
                        addedBidDto.setMessage(BID_IS_ALREADY_HIGHEST_MESSAGE);
                        return addedBidDto;
                    }
                    modifyUserBid(bid, placeBidDto);
                    addedBidDto.setBidAdded(true);
                    addedBidDto.setMessage(BID_PLACED_SUCCESSFULLY_MESSAGE);
                    return addedBidDto;
                }
            }
        }
        Bid newBid = new Bid();


        if(product.getStartPrice() > placeBidDto.getBidPrice()){
            addedBidDto.setBidAdded(false);
            addedBidDto.setMessage("Enter $"+product.getStartPrice()+ " or more.");
            return addedBidDto;
        }

        newBid.setProduct(product);
        newBid.setCustomer(customer);
        newBid.setBidPrice(placeBidDto.getBidPrice());
        newBid.setDateOfBidPlacement(LocalDateTime.now());

        bidRepository.save(newBid);

        addedBidDto.setBidAdded(true);
        addedBidDto.setMessage(BID_PLACED_SUCCESSFULLY_MESSAGE);
        return addedBidDto;
    }

    public Bid getCustomerBidForProduct(Integer customerId, Integer productId){
        List<Bid> bids = bidRepository.findByCustomerIdOrderByBidPrice(customerId);
        Bid customerBidForProduct = null;
        for (Bid bid:bids) {
            if(bid.getProduct().getId().equals(productId))
                customerBidForProduct = bid;
        }
        return customerBidForProduct;
    }
    
}
