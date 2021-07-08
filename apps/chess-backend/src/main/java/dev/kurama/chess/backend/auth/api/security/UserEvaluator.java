package dev.kurama.chess.backend.auth.api.security;

import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.getCurrentUsername;

import org.springframework.stereotype.Component;

@Component
public class UserEvaluator {

  public boolean isCurrentUser(String username) {
    return getCurrentUsername().equals(username);
  }
}
