package dev.kurama.chess.backend.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthorAuthority {

  public static final String AUTHOR_CREATE = "author:create";
  public static final String AUTHOR_READ = "author:read";
  public static final String AUTHOR_UPDATE = "author:update";
  public static final String AUTHOR_DELETE = "author:delete";
}
