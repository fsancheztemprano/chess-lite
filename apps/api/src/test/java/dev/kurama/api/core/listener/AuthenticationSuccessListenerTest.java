package dev.kurama.api.core.listener;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.service.LoginAttemptService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class AuthenticationSuccessListenerTest {


  @InjectMocks
  private AuthenticationSuccessListener listener;

  @Mock
  private LoginAttemptService loginAttemptService;

  @Test
  void should_remove_username_from_login_attempt_cache() {
    Authentication authentication = mock(Authentication.class);
    UserPrincipal principal = mock(UserPrincipal.class);
    doReturn("Username").when(principal).getUsername();
    doReturn(principal).when(authentication).getPrincipal();
    AuthenticationSuccessEvent event = new AuthenticationSuccessEvent(authentication);

    listener.onAuthenticationSuccess(event);

    verify(loginAttemptService).evictUserFromLoginAttemptCache(principal.getUsername());
  }
}
