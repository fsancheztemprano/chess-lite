package dev.kurama.api.core.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

  @InjectMocks
  private UserDetailsServiceImpl service;

  @Mock
  private UserRepository userRepository;

  @Mock
  private LoginAttemptService loginAttemptService;


  @Nested
  class LoadUserByUsernameTests {

    @Test
    void should_load_user_by_username() {
      User expected = User.builder()
        .setRandomUUID()
        .username("username")
        .locked(false)
        .build();
      when(userRepository.findUserByUsername(expected.getUsername())).thenReturn(Optional.of(expected));
      when(loginAttemptService.hasExceededMaxAttempts(expected.getUsername())).thenReturn(false);

      UserDetails actual = service.loadUserByUsername(expected.getUsername());

      verify(loginAttemptService).hasExceededMaxAttempts(expected.getUsername());
      verify(userRepository).save(expected);
      assertThat(actual).isNotNull();
      User actualUser = (User) ReflectionTestUtils.getField(actual, "user");
      assertThat(actualUser).isNotNull()
        .hasFieldOrPropertyWithValue("id", expected.getId())
        .hasFieldOrPropertyWithValue("locked", false);
    }

    @Test
    void should_evict_if_user_was_locked() {
      User expected = User.builder()
        .setRandomUUID()
        .username("username")
        .locked(true)
        .build();
      when(userRepository.findUserByUsername(expected.getUsername())).thenReturn(Optional.of(expected));

      service.loadUserByUsername(expected.getUsername());

      verify(loginAttemptService).evictUserFromLoginAttemptCache(expected.getUsername());
    }
  }
}
