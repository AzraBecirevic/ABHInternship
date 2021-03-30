package com.app.auctionbackend.service;

import com.app.auctionbackend.dtos.GenderDto;
import com.app.auctionbackend.model.Gender;
import com.app.auctionbackend.repo.GenderRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("genderService")
public class GenderService {

    @Autowired
    private GenderRepository genderRepository;

    public List<GenderDto> getGenders(){
        List<Gender> genders = genderRepository.findAll();
        if(genders == null)
            return null;
        ModelMapper modelMapper = new ModelMapper();
        List<GenderDto> genderDtos = new ArrayList<>();
        for (Gender g : genders) {
            GenderDto genderDto = modelMapper.map(g, GenderDto.class);
            genderDtos.add(genderDto);
        }
        return genderDtos;
    }
}
