package dev.kurama.api.core.service;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import dev.kurama.support.TestEmailConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationManager;

@ServiceLayerIntegrationTestConfig
@Import({AuthenticationFacility.class, UserService.class, JWTTokenProvider.class, AuthorityService.class,
  ActivationTokenService.class, EmailService.class, TestEmailConfiguration.class, RoleService.class,
  GlobalSettingsService.class,})
class AuthenticationFacilityIT {

  @Autowired
  private AuthenticationFacility facility;

  @Autowired
  private TestEntityManager entityManager;

  @MockBean
  private AuthenticationManager authenticationManager;

  @Test
  void should_login() throws RoleCanNotLoginException {
    User user = User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .role(Role.builder().setRandomUUID().canLogin(true).build())
      .build();
    entityManager.persist(user.getRole());
    entityManager.persist(user);

    assertThat(facility.login(user.getUsername(), "pass").getLeft().getId()).isEqualTo(user.getId());
  }
}
