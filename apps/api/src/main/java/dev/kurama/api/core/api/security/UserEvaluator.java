package dev.kurama.api.core.api.security;

import dev.kurama.api.core.utility.AuthorityUtils;
import org.springframework.stereotype.Component;

@Component
public class UserEvaluator {

  public boolean isCurrentUser(String username) {
    return AuthorityUtils.isCurrentUsername(username);
  }
}
