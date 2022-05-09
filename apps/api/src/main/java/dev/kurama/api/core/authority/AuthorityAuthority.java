package dev.kurama.api.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component("AuthorityAuthority")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthorityAuthority {

  public static final String AUTHORITY_CREATE = "authority:create";
  public static final String AUTHORITY_READ = "authority:read";
  public static final String AUTHORITY_UPDATE = "authority:update";
  public static final String AUTHORITY_DELETE = "authority:delete";

}
