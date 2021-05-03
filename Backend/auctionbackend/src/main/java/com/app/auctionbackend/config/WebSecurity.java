package com.app.auctionbackend.config;

import com.google.common.collect.ImmutableList;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Bean;

import static com.app.auctionbackend.config.EndpointConstants.*;
import static com.app.auctionbackend.config.SecurityConstants.SIGN_UP_URL;


@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {
    private UserDetailsServiceImpl userDetailsService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public WebSecurity(UserDetailsServiceImpl userDetailsService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()
                .antMatchers(FORGET_PASSWORD_URL,CHANGE_PASSWORD_URL,SIGN_UP_URL, CATEGORY_URL, GET_OFFERED_PRODUCTS_URL, GET_PRODUCT_BY_ID_URL, GET_PRODUCT_BY_CATEGORY_ID_URL, GET_NEW_ARRIVALS_URL, GET_LAST_CHANCE_URL, GET_SWAGGER_URL, GET_MOST_EXPENSIVE_PRODUCT_URL, GET_BIDS_BY_PRODUCT_ID_URL, GET_PRODUCT_BY_NAME_URL, GET_SUBCATEGORIES_BY_CATEGORY_ID, GET_FILTERED_PRODUCTS, GET_PRICE_FILTER_VALUES, CHECK_IS_ACCOUNT_ACTIVE_ENDPOINT, GET_RECOMMENDED_PRODUCTS, SAVE_NOTIFICATION_TOKEN).permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilter(new JWTAuthenticationFilter(authenticationManager()))
                .addFilter(new JWTAuthorizationFilter(authenticationManager()))
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        CorsConfiguration config = new CorsConfiguration();


        source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
        return source;
    }
}
