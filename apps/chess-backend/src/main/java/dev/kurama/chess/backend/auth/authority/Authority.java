package dev.kurama.chess.backend.auth.authority;

import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_CREATE;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_DELETE;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_READ;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_UPDATE;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_CREATE;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_DELETE;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_READ;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_UPDATE;
import static dev.kurama.chess.backend.core.authority.BookAuthority.BOOK_CREATE;
import static dev.kurama.chess.backend.core.authority.BookAuthority.BOOK_DELETE;
import static dev.kurama.chess.backend.core.authority.BookAuthority.BOOK_READ;
import static dev.kurama.chess.backend.core.authority.BookAuthority.BOOK_UPDATE;

import com.google.common.collect.Lists;
import java.util.List;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class Authority {

  public static final List<String> USER_AUTHORITIES = Lists.newArrayList(
    USER_READ,
    BOOK_READ,
    AUTHOR_READ
  );
  public static final List<String> MOD_AUTHORITIES = Lists.newArrayList(
    USER_READ,
    USER_UPDATE,
    BOOK_READ,
    BOOK_UPDATE,
    AUTHOR_READ,
    AUTHOR_UPDATE
  );
  public static final List<String> ADMIN_AUTHORITIES = Lists.newArrayList(
    USER_READ,
    USER_CREATE,
    USER_UPDATE,
    BOOK_READ,
    BOOK_UPDATE,
    BOOK_CREATE,
    AUTHOR_READ,
    AUTHOR_UPDATE,
    AUTHOR_CREATE
  );
  public static final List<String> SUPER_ADMIN_AUTHORITIES = Lists.newArrayList(
    USER_READ,
    USER_CREATE,
    USER_UPDATE,
    USER_DELETE,
    BOOK_READ,
    BOOK_UPDATE,
    BOOK_DELETE,
    BOOK_CREATE,
    AUTHOR_READ,
    AUTHOR_UPDATE,
    AUTHOR_DELETE,
    AUTHOR_CREATE
  );

}
