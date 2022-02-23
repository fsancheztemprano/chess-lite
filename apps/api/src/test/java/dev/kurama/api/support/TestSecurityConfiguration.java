package dev.kurama.api.support;

import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.core.service.LoginAttemptService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestSecurityConfiguration {

  @Bean
  public UserRepository UserRepository() {
    return Mockito.mock(UserRepository.class);
  }

  @Bean
  public LoginAttemptService LoginAttemptService() {
    return Mockito.mock(LoginAttemptService.class);
  }
}
