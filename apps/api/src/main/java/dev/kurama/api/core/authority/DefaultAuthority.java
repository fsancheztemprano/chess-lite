package dev.kurama.api.core.authority;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import java.util.Collection;
import java.util.List;
import java.util.Map;
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

  public static final List<String> ROLES = Lists.newArrayList(DefaultAuthority.USER_ROLE, DefaultAuthority.MOD_ROLE,
    DefaultAuthority.ADMIN_ROLE, DefaultAuthority.SUPER_ADMIN_ROLE);


  public static final List<String> AUTHORITIES = Lists.newArrayList(TokenAuthority.TOKEN_REFRESH,

    ProfileAuthority.PROFILE_UPDATE, ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_DELETE,

    UserAuthority.USER_READ, UserAuthority.USER_CREATE, UserAuthority.USER_UPDATE, UserAuthority.USER_UPDATE_ROLE,
    UserAuthority.USER_UPDATE_AUTHORITIES, UserAuthority.USER_DELETE,

    UserPreferencesAuthority.USER_PREFERENCES_READ, UserPreferencesAuthority.USER_PREFERENCES_UPDATE,

    RoleAuthority.ROLE_READ, RoleAuthority.ROLE_CREATE, RoleAuthority.ROLE_UPDATE, RoleAuthority.ROLE_UPDATE_CORE,
    RoleAuthority.ROLE_DELETE,

    AuthorityAuthority.AUTHORITY_CREATE, AuthorityAuthority.AUTHORITY_READ, AuthorityAuthority.AUTHORITY_UPDATE,
    AuthorityAuthority.AUTHORITY_DELETE,

    AdminAuthority.ADMIN_ROOT, AdminAuthority.ADMIN_USER_MANAGEMENT_ROOT, AdminAuthority.ADMIN_ROLE_MANAGEMENT_ROOT,

    ServiceLogsAuthority.SERVICE_LOGS_READ, ServiceLogsAuthority.SERVICE_LOGS_DELETE,

    GlobalSettingsAuthority.GLOBAL_SETTINGS_READ, GlobalSettingsAuthority.GLOBAL_SETTINGS_UPDATE,

    ThemeAuthority.THEME_UPDATE,

    TicTacToeAuthority.TIC_TAC_TOE_ROOT);


  protected static final List<String> USER_AUTHORITIES = Lists.newArrayList(TokenAuthority.TOKEN_REFRESH,
    ProfileAuthority.PROFILE_UPDATE, ProfileAuthority.PROFILE_READ, ProfileAuthority.PROFILE_DELETE);

  protected static final List<String> MOD_AUTHORITIES = Stream.of(USER_AUTHORITIES,
      Lists.newArrayList(UserAuthority.USER_READ, UserAuthority.USER_UPDATE))
    .flatMap(Collection::stream)
    .toList()
    .stream()
    .distinct()
    .toList();


  protected static final List<String> ADMIN_AUTHORITIES = Stream.of(MOD_AUTHORITIES,
    TicTacToeAuthority.TIC_TAC_TOE_AUTHORITIES,
    Lists.newArrayList(UserAuthority.USER_CREATE, ServiceLogsAuthority.SERVICE_LOGS_READ,
      ServiceLogsAuthority.SERVICE_LOGS_DELETE)).flatMap(Collection::stream).toList();

  public static final Map<String, List<String>> ROLE_AUTHORITIES = ImmutableMap.<String, List<String>>builder()
    .put(DefaultAuthority.USER_ROLE, DefaultAuthority.USER_AUTHORITIES)
    .put(DefaultAuthority.MOD_ROLE, DefaultAuthority.MOD_AUTHORITIES)
    .put(DefaultAuthority.ADMIN_ROLE, DefaultAuthority.ADMIN_AUTHORITIES)
    .put(DefaultAuthority.SUPER_ADMIN_ROLE, DefaultAuthority.AUTHORITIES)
    .build();
}
