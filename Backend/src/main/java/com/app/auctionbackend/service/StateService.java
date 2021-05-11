package com.app.auctionbackend.service;

import com.app.auctionbackend.model.Country;
import com.app.auctionbackend.model.State;
import com.app.auctionbackend.repo.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("stateService")
public class StateService {

    @Autowired
    private StateRepository stateRepository;

    State saveState(String stateName, Country country){
        List<State> stateList = stateRepository.findAll();

        for (State s : stateList) {
            if(s.getName().toLowerCase().equals(stateName.toLowerCase())){
                return s;
            }
        }
        State state = new State();
        state.setName(stateName);
        state.setCountry(country);
        stateRepository.save(state);
        return state;
    }
}
