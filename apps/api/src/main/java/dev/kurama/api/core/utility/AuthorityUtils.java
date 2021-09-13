package dev.kurama.api.core.utility;

import com.google.common.collect.Lists;
import dev.kurama.api.core.filter.ContextUser;
import java.util.Collection;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthorityUtils {

  public static Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  private static ContextUser getContextUser() {
    return (ContextUser) getAuthentication().getPrincipal();
  }

  public static String getCurrentUserId() {
    return getContextUser().getId();
  }

  public static boolean isCurrentUserId(String id) {
    return getCurrentUserId().equals(id);
  }

  public static String getCurrentUsername() {
    return isAuthenticated() ? getContextUser().getUsername() : "anonymousUser";
  }

  public static boolean isCurrentUsername(String username) {
    return getCurrentUsername().equals(username);
  }

  public static Collection<? extends GrantedAuthority> getAuthorities() {
    return getAuthentication() == null ? Lists.newArrayList() : getAuthentication().getAuthorities();
  }

  public static boolean hasAuthority(String authority) {
    return getAuthorities().contains(new SimpleGrantedAuthority(authority));
  }

  public static boolean isAuthenticated() {
    return !getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ANONYMOUS"));
  }
}
