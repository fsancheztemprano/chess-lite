package dev.kurama.api.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ProfileAuthority {

  public static final String PROFILE_READ = "profile:read";
  public static final String PROFILE_UPDATE = "profile:update";
  public static final String PROFILE_DELETE = "profile:delete";
}
