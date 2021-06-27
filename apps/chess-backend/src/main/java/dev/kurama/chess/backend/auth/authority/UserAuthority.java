package dev.kurama.chess.backend.auth.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserAuthority {

  public static final String USER_CREATE = "user:create";
  public static final String USER_READ = "user:read";
  public static final String USER_UPDATE = "user:update";
  public static final String USER_DELETE = "user:delete";
}
