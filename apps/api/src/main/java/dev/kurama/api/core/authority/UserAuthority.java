package dev.kurama.api.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component("UserAuthority")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserAuthority {

  public static final String USER_CREATE = "user:create";
  public static final String USER_READ = "user:read";
  public static final String USER_UPDATE = "user:update";
  public static final String USER_UPDATE_ROLE = "user:update:role";
  public static final String USER_UPDATE_AUTHORITIES = "user:update:authorities";
  public static final String USER_DELETE = "user:delete";

}
