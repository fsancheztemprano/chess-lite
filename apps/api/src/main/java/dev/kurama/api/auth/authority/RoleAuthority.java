package dev.kurama.api.auth.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleAuthority {

  public static final String ROLE_CREATE = "role:create";
  public static final String ROLE_READ = "role:read";
  public static final String ROLE_UPDATE = "role:update";
  public static final String ROLE_DELETE = "role:delete";

}
