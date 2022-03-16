package dev.kurama.support;

import dev.kurama.api.core.service.ActivationTokenService;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.AuthorityService;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.api.core.service.RoleFacility;
import dev.kurama.api.core.service.RoleService;
import dev.kurama.api.core.service.ServiceLogsService;
import dev.kurama.api.core.service.UserPreferencesService;
import dev.kurama.api.core.service.UserService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class MockServiceLayerConfig {

  @Bean
  @Primary
  public ActivationTokenService ActivationTokenService() {
    return Mockito.mock(ActivationTokenService.class);
  }

  @Bean
  @Primary
  public AuthenticationFacility AuthenticationFacility() {
    return Mockito.mock(AuthenticationFacility.class);
  }

  @Bean
  @Primary
  public AuthorityService AuthorityService() {
    return Mockito.mock(AuthorityService.class);
  }

  @Bean
  @Primary
  public GlobalSettingsService GlobalSettingsService() {
    return Mockito.mock(GlobalSettingsService.class);
  }

  @Bean
  @Primary
  public RoleService RoleService() {
    return Mockito.mock(RoleService.class);
  }

  @Bean
  @Primary
  public RoleFacility RoleFacility() {
    return Mockito.mock(RoleFacility.class);
  }

  @Bean
  @Primary
  public ServiceLogsService ServiceLogsService() {
    return Mockito.mock(ServiceLogsService.class);
  }

  @Bean
  @Primary
  public UserPreferencesService UserPreferencesService() {
    return Mockito.mock(UserPreferencesService.class);
  }

  @Bean
  @Primary
  public UserService UserService() {
    return Mockito.mock(UserService.class);
  }
}
