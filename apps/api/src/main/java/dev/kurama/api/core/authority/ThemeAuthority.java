package dev.kurama.api.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component("ThemeAuthority")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ThemeAuthority {

  public static final String THEME_UPDATE = "theme:update";

}
