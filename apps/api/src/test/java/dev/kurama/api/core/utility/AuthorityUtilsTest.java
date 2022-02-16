package dev.kurama.api.core.utility;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.filter.ContextUser;
import java.util.Collection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class AuthorityUtilsTest {

  @Mock
  private Authentication authentication;

  @Mock
  private SecurityContext securityContext;

  private ContextUser contextUser;

  @BeforeEach
  void setUp() {
    contextUser = ContextUser.builder()
      .id(randomUUID())
      .username("username")
      .build();
    when(securityContext.getAuthentication()).thenReturn(authentication);
    SecurityContextHolder.setContext(securityContext);
    when(authentication.getPrincipal()).thenReturn(contextUser);
  }

  @Test
  void getAuthentication() {
    assertEquals(authentication, AuthorityUtils.getAuthentication());
  }

  @Test
  void getContextUser() {
    assertEquals(contextUser, AuthorityUtils.getContextUser());
  }

  @Test
  void getCurrentUserId() {
    assertEquals(contextUser.getId(), AuthorityUtils.getCurrentUserId());
  }

  @Test
  void isCurrentUserId() {
    assertThat(AuthorityUtils.isCurrentUserId(contextUser.getId())).isTrue();
    assertThat(AuthorityUtils.isCurrentUserId(randomUUID())).isFalse();
  }

  @Test
  void getCurrentUsername() {
    assertEquals(contextUser.getUsername(), AuthorityUtils.getCurrentUsername());
  }

  @Test
  void isCurrentUsername() {
    assertTrue(AuthorityUtils.isCurrentUsername(contextUser.getUsername()));
    assertFalse(AuthorityUtils.isCurrentUsername("other_username"));
  }

  @Test
  void getAuthorities() {
    Collection<SimpleGrantedAuthority> simpleGrantedAuthorities =
      newArrayList(new SimpleGrantedAuthority("auth:a"), new SimpleGrantedAuthority("auth:b"));
    doReturn(simpleGrantedAuthorities).when(authentication)
      .getAuthorities();

    assertEquals(simpleGrantedAuthorities, AuthorityUtils.getAuthorities());
  }

  @Test
  void hasAuthority() {
    SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority("auth:a");
    Collection<SimpleGrantedAuthority> simpleGrantedAuthorities =
      newArrayList(simpleGrantedAuthority, new SimpleGrantedAuthority("auth:b"));
    doReturn(simpleGrantedAuthorities).when(authentication)
      .getAuthorities();

    assertTrue(AuthorityUtils.hasAuthority(simpleGrantedAuthority.toString()));
    assertFalse(AuthorityUtils.hasAuthority("auth:c"));
  }

  @Test
  void hasAllAuthorities() {
    SimpleGrantedAuthority simpleGrantedAuthority1 = new SimpleGrantedAuthority("auth:a");
    SimpleGrantedAuthority simpleGrantedAuthority2 = new SimpleGrantedAuthority("auth:b");
    Collection<SimpleGrantedAuthority> simpleGrantedAuthorities =
      newArrayList(simpleGrantedAuthority1, simpleGrantedAuthority2);
    doReturn(simpleGrantedAuthorities).when(authentication)
      .getAuthorities();

    assertTrue(
      AuthorityUtils.hasAllAuthorities(simpleGrantedAuthority1.toString(), simpleGrantedAuthority2.toString()));
    assertFalse(AuthorityUtils.hasAllAuthorities(simpleGrantedAuthority1.toString(), "auth:c"));
  }

  @Test
  void hasAnyAuthority() {
    SimpleGrantedAuthority simpleGrantedAuthority1 = new SimpleGrantedAuthority("auth:a");
    SimpleGrantedAuthority simpleGrantedAuthority2 = new SimpleGrantedAuthority("auth:b");
    Collection<SimpleGrantedAuthority> simpleGrantedAuthorities =
      newArrayList(simpleGrantedAuthority1, simpleGrantedAuthority2);
    doReturn(simpleGrantedAuthorities).when(authentication)
      .getAuthorities();

    assertTrue(
      AuthorityUtils.hasAnyAuthority(simpleGrantedAuthority1.toString(), simpleGrantedAuthority2.toString()));
    assertTrue(AuthorityUtils.hasAnyAuthority(simpleGrantedAuthority1.toString(), "auth:c"));
    assertFalse(AuthorityUtils.hasAnyAuthority("auth:c", "auth:d"));
  }

  @Test
  void isAuthenticated() {
    SimpleGrantedAuthority anonymous = new SimpleGrantedAuthority("auth:a");
    Collection<SimpleGrantedAuthority> simpleGrantedAuthorities =
      newArrayList(anonymous);
    doReturn(simpleGrantedAuthorities).when(authentication)
      .getAuthorities();

    assertTrue(AuthorityUtils.isAuthenticated());

    anonymous = new SimpleGrantedAuthority("ROLE_ANONYMOUS");
    simpleGrantedAuthorities =
      newArrayList(anonymous);
    doReturn(simpleGrantedAuthorities).when(authentication)
      .getAuthorities();

    assertFalse(AuthorityUtils.isAuthenticated());
  }
}
