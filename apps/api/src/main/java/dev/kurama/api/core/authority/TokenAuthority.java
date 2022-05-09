package dev.kurama.api.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component("TokenAuthority")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TokenAuthority {

  public static final String TOKEN_REFRESH = "token:refresh";
}
