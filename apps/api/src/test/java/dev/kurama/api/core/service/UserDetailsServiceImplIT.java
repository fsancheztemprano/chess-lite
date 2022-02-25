package dev.kurama.api.core.service;

import static dev.kurama.api.core.service.LoginAttemptService.MAXIMUM_NUMBER_OF_ATTEMPTS;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.support.ServiceLayerIntegrationTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({UserDetailsServiceImpl.class, LoginAttemptService.class})
class UserDetailsServiceImplIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  LoginAttemptService loginAttemptService;

  @Test
  void should_load_user_by_username() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(4)).build());
    User expected = entityManager.persist(
      User.builder().setRandomUUID().username(randomAlphanumeric(3)).locked(false).role(role).build());

    UserPrincipal actual = (UserPrincipal) userDetailsService.loadUserByUsername(expected.getUsername());

    assertThat(actual.getUser()).isEqualTo(expected);
  }

  @Test
  void should_evict_user_from_login_attempt_cache_on_successful_login() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(4)).build());
    User expected = entityManager.persist(
      User.builder().setRandomUUID().username(randomAlphanumeric(3)).locked(true).role(role).build());
    for (int i = 0; i < MAXIMUM_NUMBER_OF_ATTEMPTS; i++) {
      loginAttemptService.addUserToLoginAttemptCache(expected.getUsername());
    }

    UserPrincipal actual = (UserPrincipal) userDetailsService.loadUserByUsername(expected.getUsername());

    assertThat(actual.getUser()).isEqualTo(expected);
    assertThat(loginAttemptService.hasExceededMaxAttempts(expected.getUsername())).isFalse();
  }
}
