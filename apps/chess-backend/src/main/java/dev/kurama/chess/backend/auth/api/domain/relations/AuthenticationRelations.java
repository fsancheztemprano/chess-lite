package dev.kurama.chess.backend.auth.api.domain.relations;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthenticationRelations {

  public static final String LOGIN_REL = "login";
  public static final String SIGNUP_REL = "signup";
}
