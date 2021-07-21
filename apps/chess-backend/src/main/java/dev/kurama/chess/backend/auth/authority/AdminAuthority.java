package dev.kurama.chess.backend.auth.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AdminAuthority {

  public static final String ADMIN_ROOT = "admin:root";
  public static final String ADMIN_USER_MANAGEMENT_ROOT = "admin:user-management:root";

}
