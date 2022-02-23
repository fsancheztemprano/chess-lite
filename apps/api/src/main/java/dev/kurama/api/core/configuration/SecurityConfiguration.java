package dev.kurama.api.core.configuration;

import dev.kurama.api.core.filter.JWTAccessDeniedHandler;
import dev.kurama.api.core.filter.JWTAuthenticationEntryPoint;
import dev.kurama.api.core.filter.JWTAuthorizationFilter;
import dev.kurama.api.core.properties.ApplicationProperties;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableConfigurationProperties(ApplicationProperties.class)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

  @NonNull
  @Qualifier("userDetailsService")
  private final UserDetailsService userDetailsService;

  @NonNull
  private final JWTAuthorizationFilter jwtAuthorizationFilter;

  @NonNull
  private final JWTAuthenticationEntryPoint jwtAuthenticationEntryPoint;

  @NonNull
  private final JWTAccessDeniedHandler jwtAccessDeniedHandler;

  @NonNull
  private final BCryptPasswordEncoder bCryptPasswordEncoder;

  @NonNull
  private final ApplicationProperties applicationProperties;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.csrf()
      .disable()
      .cors()
      .and()
      .sessionManagement()
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
      .authorizeRequests()
      .antMatchers(applicationProperties.getPublicUrls())
      .permitAll()
      .anyRequest()
      .authenticated()
      .and()
      .exceptionHandling()
      .accessDeniedHandler(jwtAccessDeniedHandler)
      .authenticationEntryPoint(jwtAuthenticationEntryPoint)
      .and()
      .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
  }

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }
}
