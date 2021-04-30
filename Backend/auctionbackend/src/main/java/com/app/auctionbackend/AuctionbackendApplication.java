package com.app.auctionbackend;

import com.app.auctionbackend.config.SchedulerConfig;
import com.app.auctionbackend.config.SecretKeyHandler;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Properties;

import static com.app.auctionbackend.config.SecurityConstants.SECRET;


@Import({SchedulerConfig.class})
@SpringBootApplication
public class AuctionbackendApplication {

	@Value("${spring.mail.username}")
	String email;

	@Value("${spring.mail.password}")
	String password;

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public JavaMailSender getJavaMailSender() {

		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost("smtp.gmail.com");
		mailSender.setPort(587);

		mailSender.setUsername(email);
		mailSender.setPassword(password);

		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.transport.protocol", "smtp");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.debug", "true");

		return mailSender;

	}

	public static void main(String[] args) {

		ApplicationContext ctx = SpringApplication.run(AuctionbackendApplication.class, args);

		SecretKeyHandler skh = (SecretKeyHandler) ctx.getBean("secretKeyHandler");

		SECRET = skh.tokenKey;

	}

}
