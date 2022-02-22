package dev.kurama.api.core.service;

import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_DELAY;
import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_MAX_ATTEMPTS;
import static java.lang.Math.toIntExact;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.repository.ActivationTokenRepository;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles(value = "integration-test")
@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@Import(ActivationTokenService.class)
class ActivationTokenServiceIT {

  @Autowired
  private ActivationTokenService service;

  @Autowired
  private ActivationTokenRepository repository;

  private ActivationToken token1;

  @BeforeEach
  void setUp() {
    token1 = repository.save(ActivationToken.builder()
      .setRandomUUID()
      .created(new Date(System.currentTimeMillis() - ACTIVATION_TOKEN_DELAY - 1))
      .attempts(0)
      .build());
  }

  @Test
  void should_remove_activation_token_if_exists_and_is_expired() throws ActivationTokenRecentException {
    User user = User.builder().setRandomUUID().activationToken(token1).build();

    ActivationToken actual = service.createActivationToken(user);

    assertThat(actual.getId()).isNotEqualTo(token1.getId());
    assertThat(repository.findById(token1.getId())).isEmpty();
  }

  @Test
  void should_find_activation_token() throws ActivationTokenExpiredException, ActivationTokenNotFoundException {
    assertThat(service.findActivationToken(token1.getId()).getId()).isEqualTo(token1.getId());
  }

  @Test
  void should_verify_activation_token_match() throws ActivationTokenUserMismatchException {
    User user = User.builder().setRandomUUID().activationToken(token1).build();
    token1.setUser(User.builder().setRandomUUID().build());
    token1.setAttempts(toIntExact(ACTIVATION_TOKEN_MAX_ATTEMPTS) + 1);

    assertThrows(ActivationTokenUserMismatchException.class, () -> {
      service.verifyActivationTokenMatch(token1, user);
      assertThat(repository.findById(token1.getId())).isEmpty();
    });
  }
}
