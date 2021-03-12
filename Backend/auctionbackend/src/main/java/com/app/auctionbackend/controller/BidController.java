package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.BidDto;
import com.app.auctionbackend.dtos.PlaceBidDto;
import com.app.auctionbackend.model.Bid;
import com.app.auctionbackend.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bid")
public class BidController {

    @Autowired
    BidService bidService;

    @GetMapping(value = "/byProductId/{productId}")
    public ResponseEntity<List<BidDto>>  getBidsByProductId (@PathVariable Integer productId){
        if(productId<=0){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        List<BidDto> bidDtoList = bidService.getBidsByProductId(productId);
        return new ResponseEntity<List<BidDto>>(bidDtoList,HttpStatus.OK);

    }

    @PostMapping("/add")
    public ResponseEntity<Boolean> addBid(@RequestBody PlaceBidDto placeBidDto){
      if(placeBidDto!=null && placeBidDto.getProductId()<=0)
            return new ResponseEntity(false, HttpStatus.BAD_REQUEST);

        Boolean bidPlaced = bidService.addBid(placeBidDto);
        if(bidPlaced)
            return new ResponseEntity(true, HttpStatus.OK);

        return new ResponseEntity(false, HttpStatus.OK);
    }

}
