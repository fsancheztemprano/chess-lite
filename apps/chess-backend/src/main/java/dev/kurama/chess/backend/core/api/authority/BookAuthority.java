package dev.kurama.chess.backend.core.api.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class BookAuthority {

  public static final String BOOK_CREATE = "book:create";
  public static final String BOOK_READ = "book:read";
  public static final String BOOK_UPDATE = "book:update";
  public static final String BOOK_DELETE = "book:delete";
}
