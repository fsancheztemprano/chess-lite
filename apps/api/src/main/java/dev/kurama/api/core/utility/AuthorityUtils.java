package dev.kurama.api.core.utility;

import com.google.common.collect.Lists;
import dev.kurama.api.core.filter.ContextUser;
import java.util.Arrays;
import java.util.Collection;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthorityUtils {

  public static SecurityContext getContext() {
    return SecurityContextHolder.getContext();
  }

  public static void setAuthenticationContext(Authentication authentication) {
    getContext().setAuthentication(authentication);
  }

  public static void setContextUser(ContextUser contextUser, String... authorities) {
    setAuthenticationContext(new UsernamePasswordAuthenticationToken(contextUser, null,
      Arrays.stream(authorities).map(SimpleGrantedAuthority::new).toList()));
  }

  public static Authentication getAuthentication() {
    return getContext().getAuthentication();
  }

  public static ContextUser getContextUser() {
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

  public static boolean hasAllAuthorities(String... authorities) {
    return Arrays.stream(authorities).allMatch(AuthorityUtils::hasAuthority);
  }

  public static boolean hasAnyAuthority(String... authorities) {
    return Arrays.stream(authorities).anyMatch(AuthorityUtils::hasAuthority);
  }

  public static boolean isAuthenticated() {
    return !getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ANONYMOUS"));
  }
}
