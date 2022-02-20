package dev.kurama.api.core.listener;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.service.LoginAttemptService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

@ExtendWith(MockitoExtension.class)
class AuthenticationFailureListenerTest {

  @InjectMocks
  private AuthenticationFailureListener listener;

  @Mock
  private LoginAttemptService loginAttemptService;

  @Test
  void should_add_username_to_login_attempt_cache() {
    Authentication authentication = mock(Authentication.class);
    AuthenticationException exception = mock(AuthenticationException.class);
    String principal = "ANON_USER";
    doReturn(principal).when(authentication).getPrincipal();
    AuthenticationFailureBadCredentialsEvent event = new AuthenticationFailureBadCredentialsEvent(authentication,
      exception);

    listener.onAuthenticationFailure(event);

    verify(loginAttemptService).addUserToLoginAttemptCache(principal);
  }
}
