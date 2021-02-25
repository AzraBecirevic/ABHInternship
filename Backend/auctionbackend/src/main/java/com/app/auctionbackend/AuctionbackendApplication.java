package com.app.auctionbackend;

import com.app.auctionbackend.config.SecretKeyHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static com.app.auctionbackend.config.SecurityConstants.SECRET;

@SpringBootApplication
public class AuctionbackendApplication {

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}


	public static void main(String[] args) {

		ApplicationContext ctx = SpringApplication.run(AuctionbackendApplication.class, args);

		SecretKeyHandler skh = (SecretKeyHandler) ctx.getBean("secretKeyHandler");

		SECRET = skh.tokenKey;

	}

}
