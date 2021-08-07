package dev.kurama.chess.backend.auth.configuration.development.halexplorer;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Order(2)
@Configuration
@RequiredArgsConstructor
public class HalExplorerConfiguration extends WebSecurityConfigurerAdapter {

  public static final String[] HAL_EXPLORER_PATHS = {"/explorer/**"};

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .csrf().disable()
      .authorizeRequests().antMatchers(HAL_EXPLORER_PATHS).permitAll();
  }
}
