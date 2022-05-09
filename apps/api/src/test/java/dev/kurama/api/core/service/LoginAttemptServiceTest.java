package dev.kurama.api.core.service;

import static dev.kurama.api.core.service.LoginAttemptService.MAXIMUM_NUMBER_OF_ATTEMPTS;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.google.common.cache.LoadingCache;
import java.util.concurrent.ExecutionException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class LoginAttemptServiceTest {

  @InjectMocks
  private LoginAttemptService loginAttemptService;

  @Test
  void evict_user_from_login_attempt_cache() {
    String username = randomAlphanumeric(8);
    LoadingCache<String, Integer> loginAttemptCache = (LoadingCache<String, Integer>) ReflectionTestUtils.getField(
      loginAttemptService, "loginAttemptCache");
    assertThat(loginAttemptCache).isNotNull();

    loginAttemptService.addUserToLoginAttemptCache(username);
    assertThat(loginAttemptCache.size()).isEqualTo(1);

    loginAttemptService.evictUserFromLoginAttemptCache(username);
    assertThat(loginAttemptCache.size()).isZero();
  }

  @Test
  void should_add_user_to_login_attempt_cache() throws ExecutionException {
    String username = randomAlphanumeric(8);
    LoadingCache<String, Integer> loginAttemptCache = (LoadingCache<String, Integer>) ReflectionTestUtils.getField(
      loginAttemptService, "loginAttemptCache");
    assertThat(loginAttemptCache).isNotNull();
    assertThat(loginAttemptCache.size()).isZero();

    loginAttemptService.addUserToLoginAttemptCache(username);

    assertThat(loginAttemptCache.size()).isEqualTo(1);
    assertThat(loginAttemptCache.get(username)).isEqualTo(1);
  }

  @Test
  void should_increment_user_attempts_in_login_attempt_cache() throws ExecutionException {
    String username1 = randomAlphanumeric(8);
    String username2 = randomAlphanumeric(8);
    LoadingCache<String, Integer> loginAttemptCache = (LoadingCache<String, Integer>) ReflectionTestUtils.getField(
      loginAttemptService, "loginAttemptCache");
    assertThat(loginAttemptCache).isNotNull();

    loginAttemptService.addUserToLoginAttemptCache(username1);
    loginAttemptService.addUserToLoginAttemptCache(username2);
    loginAttemptService.addUserToLoginAttemptCache(username1);

    assertThat(loginAttemptCache.size()).isEqualTo(2);
    assertThat(loginAttemptCache.get(username1)).isEqualTo(2);
    assertThat(loginAttemptCache.get(username2)).isEqualTo(1);
  }

  @Test
  void should_return_true_only_when_maximum_attempts_exceeded() {
    String username = randomAlphanumeric(8);
    for (int attempt = 1; attempt <= MAXIMUM_NUMBER_OF_ATTEMPTS; attempt++) {
      loginAttemptService.addUserToLoginAttemptCache(username);
      assertThat(loginAttemptService.hasExceededMaxAttempts(username)).isEqualTo(
        (attempt >= MAXIMUM_NUMBER_OF_ATTEMPTS));
    }
  }
}
