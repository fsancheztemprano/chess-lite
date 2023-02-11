package dev.kurama.api.core.configuration;

import dev.kurama.api.core.filter.JWTAccessDeniedHandler;
import dev.kurama.api.core.filter.JWTAuthenticationEntryPoint;
import dev.kurama.api.core.filter.JWTAuthorizationFilter;
import dev.kurama.api.core.properties.ApplicationProperties;
import dev.kurama.api.core.service.UserDetailsServiceImpl;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
@EnableConfigurationProperties(ApplicationProperties.class)
public class SecurityConfiguration {

  @NonNull
  private final JWTAuthorizationFilter jwtAuthorizationFilter;

  @NonNull
  private final JWTAuthenticationEntryPoint jwtAuthenticationEntryPoint;

  @NonNull
  private final JWTAccessDeniedHandler jwtAccessDeniedHandler;

  @NonNull
  private final ApplicationProperties applicationProperties;

  @Bean
  public AuthenticationManager authenticationManager(HttpSecurity http,
                                                     BCryptPasswordEncoder bCryptPasswordEncoder,
                                                     UserDetailsServiceImpl userDetailsServiceImpl) throws Exception {
    return http.getSharedObject(AuthenticationManagerBuilder.class)
      .userDetailsService(userDetailsServiceImpl)
      .passwordEncoder(bCryptPasswordEncoder)
      .and()
      .build();
  }

  @Bean
  public DefaultSecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf()
      .disable()
      .cors()
      .and()
      .sessionManagement()
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
      .authorizeHttpRequests()
      .requestMatchers(applicationProperties.getPublicUrls())
      .permitAll()
      .anyRequest()
      .authenticated()
      .and()
      .exceptionHandling()
      .accessDeniedHandler(jwtAccessDeniedHandler)
      .authenticationEntryPoint(jwtAuthenticationEntryPoint)
      .and()
      .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}
