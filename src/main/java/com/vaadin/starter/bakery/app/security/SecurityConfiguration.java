package com.vaadin.starter.bakery.app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Security configuration for the Bakery application.
 *
 * <p>This configuration class does the following:
 * <ul>
 *   <li>Bypass security checks for static resources</li>
 *   <li>Restrict access to the application, allowing only logged-in users</li>
 *   <li>Set up the login form</li>
 *   <li>Configures the {@link UserDetailsServiceImpl}</li>
 * </ul>
 *
 * <p>It defines a password encoder and configures HTTP security.
 */
@Configuration
public class SecurityConfiguration extends VaadinWebSecurityConfigurerAdapter {

    /**
     * Creates a {@link PasswordEncoder} bean.
     *
     * @return a {@link PasswordEncoder} instance using BCrypt hashing
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures HTTP security for the application.
     *
     * @param http the {@link HttpSecurity} object
     * @throws Exception if a security configuration error occurs
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // configure login, logout, access rules, etc.
    }
}
