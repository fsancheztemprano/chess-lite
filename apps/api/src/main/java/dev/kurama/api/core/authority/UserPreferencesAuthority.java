package dev.kurama.api.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserPreferencesAuthority {

  public static final String USER_PREFERENCES_READ = "user:preferences:read";
  public static final String USER_PREFERENCES_UPDATE = "user:preferences:update";

}
