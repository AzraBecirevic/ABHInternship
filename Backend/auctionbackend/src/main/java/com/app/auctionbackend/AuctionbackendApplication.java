package com.app.auctionbackend;

import com.app.auctionbackend.config.SecretKeyHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class AuctionbackendApplication {

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}


	public static void main(String[] args) {
        // prva verzija
		//SpringApplication.run(AuctionbackendApplication.class, args);

		ApplicationContext ctx = SpringApplication.run(AuctionbackendApplication.class, args);

		SecretKeyHandler skh = (SecretKeyHandler) ctx.getBean("secretKeyHandler");
		skh.printKey();


	}

}
