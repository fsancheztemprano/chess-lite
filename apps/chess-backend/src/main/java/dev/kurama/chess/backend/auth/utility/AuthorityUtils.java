package dev.kurama.chess.backend.auth.utility;

import com.google.common.collect.Lists;
import java.util.Collection;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthorityUtils {

  public static Authentication getPrincipal() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  public static Collection<? extends GrantedAuthority> getAuthorities() {
    return getPrincipal() == null ? Lists.newArrayList() : getPrincipal().getAuthorities();
  }

  public static boolean hasAuthority(String authority) {
    return getAuthorities().contains(new SimpleGrantedAuthority(authority));
  }

  public static boolean isAuthenticated() {
    return !getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ANONYMOUS"));
  }
}
