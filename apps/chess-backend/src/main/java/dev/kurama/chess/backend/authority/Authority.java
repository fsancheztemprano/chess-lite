package dev.kurama.chess.backend.authority;

import static dev.kurama.chess.backend.authority.Authority.UserAuthority.USER_CREATE;
import static dev.kurama.chess.backend.authority.Authority.UserAuthority.USER_DELETE;
import static dev.kurama.chess.backend.authority.Authority.UserAuthority.USER_READ;
import static dev.kurama.chess.backend.authority.Authority.UserAuthority.USER_UPDATE;

import com.google.common.collect.Lists;
import java.util.List;

public class Authority {

  public static final List<String> USER_AUTHORITIES = Lists.newArrayList(USER_READ);
  public static final List<String> MOD_AUTHORITIES = Lists.newArrayList(USER_READ, USER_UPDATE);
  public static final List<String> ADMIN_AUTHORITIES = Lists.newArrayList(USER_READ, USER_CREATE, USER_UPDATE);
  public static final List<String> SUPER_ADMIN_AUTHORITIES = Lists
    .newArrayList(USER_READ, USER_CREATE, USER_UPDATE, USER_DELETE);

  public static class UserAuthority {

    public static final String USER_CREATE = "user:create";
    public static final String USER_READ = "user:read";
    public static final String USER_UPDATE = "user:update";
    public static final String USER_DELETE = "user:delete";
  }
}
