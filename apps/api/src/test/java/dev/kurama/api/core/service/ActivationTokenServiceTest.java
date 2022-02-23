package dev.kurama.api.core.service;

import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_DELAY;
import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_EXPIRATION_TIME;
import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_MAX_ATTEMPTS;
import static java.lang.Math.toIntExact;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.repository.ActivationTokenRepository;
import java.util.Date;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class ActivationTokenServiceTest {

  @InjectMocks
  private ActivationTokenService activationTokenService;

  @Mock
  private ActivationTokenRepository activationTokenRepository;

  @Nested
  class CreateActivationTokenTests {

    @Test
    void should_create_activation_token() throws ActivationTokenRecentException {
      ActivationToken activationToken = activationTokenService.createActivationToken(User.builder().build());

      assertThat(activationToken).isNotNull().hasFieldOrPropertyWithValue("attempts", 0);
    }

    @Test
    void should_throw_if_recent_activation_token_exists() {
      assertThrows(ActivationTokenRecentException.class, () -> {
        activationTokenService.createActivationToken(
          User.builder().activationToken(ActivationToken.builder().attempts(0).created(new Date()).build()).build());
      });
    }

    @Test
    void should_delete_current_activation_token_when_its_old_enough_and_create_new_one()
      throws ActivationTokenRecentException {
      User user = User.builder()
        .activationToken(ActivationToken.builder()
          .attempts(0)
          .created(new Date(System.currentTimeMillis() - ACTIVATION_TOKEN_DELAY - 1))
          .build())
        .build();
      ActivationToken activationToken = activationTokenService.createActivationToken(user);

      verify(activationTokenRepository).delete(user.getActivationToken());
      assertThat(activationToken).isNotNull().hasFieldOrPropertyWithValue("attempts", 0);
    }
  }

  @Nested
  class FindActivationTokenTests {

    @Test
    void should_find_activation_token() throws ActivationTokenExpiredException, ActivationTokenNotFoundException {
      ActivationToken activationToken = ActivationToken.builder()
        .setRandomUUID()
        .attempts(0)
        .created(new Date())
        .build();
      when(activationTokenRepository.findById(activationToken.getId())).thenReturn(Optional.of(activationToken));

      ActivationToken actual = activationTokenService.findActivationToken(activationToken.getId());

      assertThat(actual).isNotNull().hasFieldOrPropertyWithValue("id", activationToken.getId());
    }

    @Test
    void should_throw_when_activation_token_is_expired() {
      ActivationToken activationToken = ActivationToken.builder()
        .setRandomUUID()
        .attempts(0)
        .created(new Date(System.currentTimeMillis() - ACTIVATION_TOKEN_EXPIRATION_TIME - 1))
        .build();
      when(activationTokenRepository.findById(activationToken.getId())).thenReturn(Optional.of(activationToken));

      assertThrows(ActivationTokenExpiredException.class, () -> {
        activationTokenService.findActivationToken(activationToken.getId());
      });
    }

    @Test
    void should_throw_when_activation_token_is_not_found() {
      ActivationToken activationToken = ActivationToken.builder()
        .setRandomUUID()
        .attempts(0)
        .created(new Date(System.currentTimeMillis() - ACTIVATION_TOKEN_EXPIRATION_TIME - 1))
        .build();
      when(activationTokenRepository.findById(activationToken.getId())).thenReturn(Optional.empty());

      assertThrows(ActivationTokenNotFoundException.class, () -> {
        activationTokenService.findActivationToken(activationToken.getId());
      });
    }
  }

  @Nested
  class VerifyActivationTokenTests {

    @Test
    void should_throw_if_user_id_does_not_match_token_user_id_and_increase_attempts() {
      User user = User.builder().setRandomUUID().build();
      ActivationToken activationToken = ActivationToken.builder()
        .attempts(0)
        .created(new Date())
        .user(User.builder().setRandomUUID().build())
        .build();

      assertThrows(ActivationTokenUserMismatchException.class, () -> {
        activationTokenService.verifyActivationTokenMatch(activationToken, user);
        assertThat(activationToken.getAttempts()).isEqualTo(1);
        verifyNoInteractions(activationTokenRepository);
      });
    }

    @Test
    void should_throw_and_delete_token_if_failed_attempts_exceed_maximum() throws ActivationTokenUserMismatchException {
      User user = User.builder().setRandomUUID().build();
      ActivationToken activationToken = ActivationToken.builder()
        .attempts(toIntExact(ACTIVATION_TOKEN_MAX_ATTEMPTS))
        .created(new Date())
        .user(User.builder().setRandomUUID().build())
        .build();

      assertThrows(ActivationTokenUserMismatchException.class, () -> {
        activationTokenService.verifyActivationTokenMatch(activationToken, user);
      });
      verify(activationTokenRepository).delete(activationToken);
    }
  }
}
