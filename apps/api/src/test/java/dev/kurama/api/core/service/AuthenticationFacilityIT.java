package dev.kurama.api.core.service;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import dev.kurama.support.TestEmailConfiguration;
import org.apache.commons.lang3.tuple.ImmutablePair;
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

  @Autowired
  private JWTTokenProvider tokenProvider;

  @MockBean
  private AuthenticationManager authenticationManager;

  @Test
  void should_login() throws RoleCanNotLoginException, UserNotFoundException {
    User user = User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .locked(false)
      .role(Role.builder().setRandomUUID().canLogin(true).build())
      .build();
    entityManager.persist(user.getRole());
    entityManager.persist(user);

    ImmutablePair<User, String> actual = facility.login(user.getUsername(), "pass");

    assertThat(actual.getLeft().getId()).isEqualTo(user.getId());
    assertThat(tokenProvider.isTokenValid(tokenProvider.getDecodedJWT(actual.getRight()))).isTrue();
  }

  @Test
  void should_refresh_token() throws RoleCanNotLoginException, UserNotFoundException {
    User user = User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .locked(false)
      .role(Role.builder().setRandomUUID().canLogin(true).build())
      .build();
    entityManager.persist(user.getRole());
    entityManager.persist(user);

    ImmutablePair<User, String> actual = facility.refreshToken(user.getId());

    assertThat(actual.getLeft().getId()).isEqualTo(user.getId());
    assertThat(tokenProvider.isTokenValid(tokenProvider.getDecodedJWT(actual.getRight()))).isTrue();
  }
}
