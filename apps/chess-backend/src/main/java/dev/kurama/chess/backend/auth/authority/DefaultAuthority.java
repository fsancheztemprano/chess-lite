package dev.kurama.chess.backend.auth.authority;

import com.google.common.collect.Lists;
import dev.kurama.chess.backend.poc.authority.AuthorAuthority;
import dev.kurama.chess.backend.poc.authority.BookAuthority;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class DefaultAuthority {

  public static final String USER_ROLE = "USER_ROLE";
  public static final String MOD_ROLE = "MOD_ROLE";
  public static final String ADMIN_ROLE = "ADMIN_ROLE";
  public static final String SUPER_ADMIN_ROLE = "SUPER_ADMIN_ROLE";

  public static final String DEFAULT_ROLE = USER_ROLE;

  public static final List<String> ROLES = Lists.newArrayList(
    DefaultAuthority.USER_ROLE,
    DefaultAuthority.MOD_ROLE,
    DefaultAuthority.ADMIN_ROLE,
    DefaultAuthority.SUPER_ADMIN_ROLE
  );


  public static final List<String> AUTHORITIES = Lists.newArrayList(
    BookAuthority.BOOK_READ,
    BookAuthority.BOOK_UPDATE,
    BookAuthority.BOOK_DELETE,
    BookAuthority.BOOK_CREATE,
    AuthorAuthority.AUTHOR_READ,
    AuthorAuthority.AUTHOR_UPDATE,
    AuthorAuthority.AUTHOR_DELETE,
    AuthorAuthority.AUTHOR_CREATE,

    UserAuthority.PROFILE_UPDATE,
    UserAuthority.PROFILE_READ,
    UserAuthority.PROFILE_DELETE,

    UserAuthority.USER_READ,
    UserAuthority.USER_CREATE,
    UserAuthority.USER_UPDATE,
    UserAuthority.USER_DELETE,

    RoleAuthority.ROLE_READ,
    RoleAuthority.ROLE_CREATE,
    RoleAuthority.ROLE_UPDATE,
    RoleAuthority.ROLE_DELETE,

    AuthorityAuthority.AUTHORITY_CREATE,
    AuthorityAuthority.AUTHORITY_READ,
    AuthorityAuthority.AUTHORITY_UPDATE,
    AuthorityAuthority.AUTHORITY_DELETE,

    AdminAuthority.ADMIN_ROOT,
    AdminAuthority.ADMIN_USER_MANAGEMENT_ROOT
  );


  public static final List<String> USER_AUTHORITIES = Lists.newArrayList(
    UserAuthority.PROFILE_UPDATE,
    UserAuthority.PROFILE_READ,
    UserAuthority.PROFILE_DELETE
  );

  public static final List<String> MOD_AUTHORITIES =
    Stream.of(USER_AUTHORITIES, Lists.newArrayList(UserAuthority.USER_READ, UserAuthority.USER_UPDATE))
      .flatMap(Collection::stream)
      .collect(Collectors.toList());


  public static final List<String> ADMIN_AUTHORITIES =
    Stream.of(MOD_AUTHORITIES, Lists.newArrayList(UserAuthority.USER_CREATE))
      .flatMap(Collection::stream)
      .collect(Collectors.toList());

  public static final Map<String, List<String>> ROLE_AUTHORITIES = new HashMap<String, List<String>>() {
    {
      put(DefaultAuthority.USER_ROLE, DefaultAuthority.USER_AUTHORITIES);
      put(DefaultAuthority.MOD_ROLE, DefaultAuthority.MOD_AUTHORITIES);
      put(DefaultAuthority.ADMIN_ROLE, DefaultAuthority.ADMIN_AUTHORITIES);
      put(DefaultAuthority.SUPER_ADMIN_ROLE, DefaultAuthority.AUTHORITIES);
    }
  };
}
