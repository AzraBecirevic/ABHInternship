package com.app.auctionbackend.controller;

import com.app.auctionbackend.dtos.GenderDto;
import com.app.auctionbackend.model.Gender;
import com.app.auctionbackend.repo.GenderRepository;
import com.app.auctionbackend.service.GenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/gender")
public class GenderController {

    @Autowired
    GenderService genderService;

    @GetMapping()
    public List<GenderDto> getGenders(){
        return genderService.getGenders();
    }
}
