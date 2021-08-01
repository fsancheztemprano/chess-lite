package dev.kurama.chess.backend.auth.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthorityAuthority {

  public static final String AUTHORITY_CREATE = "authority:create";
  public static final String AUTHORITY_READ = "authority:read";
  public static final String AUTHORITY_UPDATE = "authority:update";
  public static final String AUTHORITY_DELETE = "authority:delete";

}
