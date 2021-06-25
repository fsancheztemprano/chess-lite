package dev.kurama.chess.backend.auth.listener;

import dev.kurama.chess.backend.auth.domain.UserPrincipal;
import dev.kurama.chess.backend.auth.service.LoginAttemptService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AuthenticationSuccessListener {

  @NonNull
  private final LoginAttemptService loginAttemptService;

  @EventListener
  public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
    Object principal = event.getAuthentication().getPrincipal();
    if (principal instanceof UserPrincipal) {
      loginAttemptService.evictUserFromLoginAttemptCache(((UserPrincipal) principal).getUsername());
    }
  }
}
