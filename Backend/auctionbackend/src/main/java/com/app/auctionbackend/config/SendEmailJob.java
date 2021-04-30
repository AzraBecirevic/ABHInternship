package com.app.auctionbackend.config;

import com.app.auctionbackend.service.CustomerService;
import com.app.auctionbackend.service.ProductService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;

public class SendEmailJob implements Job {

    @Autowired
    private ProductService service;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        service.sendEmailForBidProduct();
    }
}
