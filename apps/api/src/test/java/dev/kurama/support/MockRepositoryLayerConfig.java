package dev.kurama.support;

import dev.kurama.api.core.repository.ActivationTokenRepository;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserPreferencesRepository;
import dev.kurama.api.core.repository.UserRepository;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class MockRepositoryLayerConfig {

  @Bean
  @Primary
  public ActivationTokenRepository ActivationTokenRepository() {
    return Mockito.mock(ActivationTokenRepository.class);
  }

  @Bean
  @Primary
  public AuthorityRepository AuthorityRepository() {
    return Mockito.mock(AuthorityRepository.class);
  }

  @Bean
  @Primary
  public GlobalSettingsRepository GlobalSettingsRepository() {
    return Mockito.mock(GlobalSettingsRepository.class);
  }

  @Bean
  @Primary
  public RoleRepository RoleRepository() {
    return Mockito.mock(RoleRepository.class);
  }

  @Bean
  @Primary
  public UserPreferencesRepository UserPreferencesRepository() {
    return Mockito.mock(UserPreferencesRepository.class);
  }

  @Bean
  @Primary
  public UserRepository UserRepository() {
    return Mockito.mock(UserRepository.class);
  }
}
