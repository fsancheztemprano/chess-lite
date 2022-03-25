package dev.kurama.api.core.hateoas.relations;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthenticationRelations {

  public static final String LOGIN_REL = "login";
  public static final String TOKEN_REL = "token";
  public static final String SIGNUP_REL = "signup";
  public static final String ACTIVATION_TOKEN_REL = "activation-token";
  public static final String ACTIVATE_ACCOUNT_REL = "activate-account";
}
