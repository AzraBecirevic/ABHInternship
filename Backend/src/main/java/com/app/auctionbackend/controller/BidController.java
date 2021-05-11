package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.AddedBidDto;
import com.app.auctionbackend.dtos.BidDto;
import com.app.auctionbackend.dtos.PlaceBidDto;
import com.app.auctionbackend.helper.Message;
import com.app.auctionbackend.service.BidService;
import com.app.auctionbackend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.app.auctionbackend.helper.ValidationMessageConstants.*;

@RestController
@RequestMapping("/bid")
public class BidController {

    @Autowired
    BidService bidService;

    @Autowired
    CustomerService customerService;

    @GetMapping(value = "/byProductId/{productId}")
    public ResponseEntity<List<BidDto>>  getBidsByProductId (@PathVariable Integer productId){
        if(productId<=0){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        List<BidDto> bidDtoList = bidService.getBidsByProductId(productId);
        return new ResponseEntity<List<BidDto>>(bidDtoList,HttpStatus.OK);
    }

   @PostMapping("/add")
   public ResponseEntity addBid(@RequestBody PlaceBidDto placeBidDto){
       if(placeBidDto == null || placeBidDto.getProductId() <= 0){
           AddedBidDto addedBidDto = new AddedBidDto();
           addedBidDto.setBidAdded(false);
           addedBidDto.setMessage(BID_NOT_THERE_CUSTOMER_NOT_ALLOWED_MESSAGE);
           return new ResponseEntity(addedBidDto, HttpStatus.BAD_REQUEST);
       }

       if(customerService.findByEmail(placeBidDto.getCustomerEmail())==null){
           return new ResponseEntity(new Message(USER_DOES_NOT_EXIST), HttpStatus.FORBIDDEN);
       }
       if(!customerService.checkIsAccountActive(placeBidDto.getCustomerEmail())){
           return new ResponseEntity(new Message(DEACTIVATED_CUSTOMER_FORBIDDEN_ACTION_MESSAGE), HttpStatus.FORBIDDEN);
       }

       AddedBidDto addedBidDto = bidService.addBid(placeBidDto);
       return new ResponseEntity(addedBidDto, HttpStatus.OK);
   }

}
