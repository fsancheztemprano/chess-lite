package dev.kurama.api.auth.api.security;

import dev.kurama.api.auth.utility.AuthorityUtils;
import org.springframework.stereotype.Component;

@Component
public class UserEvaluator {

  public boolean isCurrentUser(String username) {
    return AuthorityUtils.isCurrentUsername(username);
  }
}
