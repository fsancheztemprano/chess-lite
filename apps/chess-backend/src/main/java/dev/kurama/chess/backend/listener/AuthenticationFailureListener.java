package dev.kurama.chess.backend.listener;

import dev.kurama.chess.backend.service.LoginAttemptService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AuthenticationFailureListener {

  @NonNull
  private final LoginAttemptService loginAttemptService;

  @EventListener
  public void onAuthenticationFailure(AuthenticationFailureBadCredentialsEvent event) {
    Object principal = event.getAuthentication().getPrincipal();
    if (principal instanceof String) {
      loginAttemptService.addUserToLoginAttemptCache((String) principal);
    }
  }

}
