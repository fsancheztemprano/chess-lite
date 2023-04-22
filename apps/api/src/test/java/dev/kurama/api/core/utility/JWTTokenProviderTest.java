package dev.kurama.api.core.utility;

import static com.google.common.collect.Sets.newHashSet;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.filter.ContextUser;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(SpringExtension.class)
class JWTTokenProviderTest {

  private final long TOKEN_LIFE_SPAN = 300_000;

  private final long REFRESH_TOKEN_LIFE_SPAN = 3_600_000;

  @Spy
  @InjectMocks
  private JWTTokenProvider jwtTokenProvider;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(jwtTokenProvider, "SECRET", "secret");
    ReflectionTestUtils.setField(jwtTokenProvider, "TOKEN_LIFE_SPAN", TOKEN_LIFE_SPAN);
    ReflectionTestUtils.setField(jwtTokenProvider, "REFRESH_TOKEN_LIFE_SPAN", REFRESH_TOKEN_LIFE_SPAN);
  }

  @Test
  void generateToken() {
    Authority authority1 = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    Authority authority2 = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    User user = User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email("email@localhost")
      .authorities(newHashSet(authority1, authority2))
      .build();
    UserPrincipal userPrincipal = UserPrincipal.builder().user(user).build();
    Date before = new Date();
    doReturn(8_000_000_000_000L).when(jwtTokenProvider).getCurrentTimeMillis();

    String token = jwtTokenProvider.generateToken(userPrincipal);

    DecodedJWT decoded = jwtTokenProvider.getDecodedJWT(token);

    assertEquals(SecurityConstant.AUTH_ISSUER, decoded.getIssuer());
    assertEquals("[" + SecurityConstant.AUTH_AUDIENCE + "]", decoded.getAudience().toString());
    assertThat(decoded.getIssuedAt()).isCloseTo(before, 1000);
    assertEquals(user.getUsername(), decoded.getSubject());
    assertTrue(decoded.getClaim(SecurityConstant.AUTHORITIES)
      .asList(String.class)
      .stream()
      .allMatch(auth -> auth.equals(authority1.getName()) || auth.equals(authority2.getName())));
    Map<String, Object> userMap = decoded.getClaim("user").asMap();
    assertEquals(userMap.get("id"), user.getId());
    assertEquals(userMap.get("username"), user.getUsername());
    assertThat(decoded.getExpiresAt()).hasSameTimeAs(new Date(8_000_000_000_000L + TOKEN_LIFE_SPAN));
  }

  @Test
  void generateRefreshToken() {
    Authority authority1 = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    Authority authority2 = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    User user = User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .authorities(newHashSet(authority1, authority2))
      .build();
    UserPrincipal userPrincipal = UserPrincipal.builder().user(user).build();
    Date before = new Date();
    doReturn(8_000_000_000_000L).when(jwtTokenProvider).getCurrentTimeMillis();

    String token = jwtTokenProvider.generateRefreshToken(userPrincipal);

    DecodedJWT decoded = jwtTokenProvider.getDecodedJWT(token);

    assertEquals(SecurityConstant.AUTH_ISSUER, decoded.getIssuer());
    assertEquals("[" + SecurityConstant.AUTH_AUDIENCE + "]", decoded.getAudience().toString());
    assertThat(decoded.getIssuedAt()).isCloseTo(before, 1000);
    assertEquals(user.getUsername(), decoded.getSubject());
    assertTrue(decoded.getClaim(SecurityConstant.AUTHORITIES)
      .asList(String.class)
      .stream()
      .allMatch(auth -> auth.equals(authority1.getName()) || auth.equals(authority2.getName())));
    Map<String, Object> userMap = decoded.getClaim("user").asMap();
    assertEquals(userMap.get("id"), user.getId());
    assertEquals(userMap.get("username"), user.getUsername());
    assertThat(decoded.getExpiresAt()).hasSameTimeAs(new Date(8_000_000_000_000L + REFRESH_TOKEN_LIFE_SPAN));
  }

  @Test
  void isTokenValid() {
    User user = User.builder().setRandomUUID().username(randomAlphanumeric(8)).email("email@localhost").build();
    UserPrincipal userPrincipal = UserPrincipal.builder().user(user).build();
    String token = jwtTokenProvider.generateToken(userPrincipal);

    assertTrue(jwtTokenProvider.isTokenValid(jwtTokenProvider.getDecodedJWT(token)));

    doReturn(System.currentTimeMillis() - TOKEN_LIFE_SPAN).when(jwtTokenProvider).getCurrentTimeMillis();
    token = jwtTokenProvider.generateToken(userPrincipal);

    String finalToken = token;
    assertThrows(TokenExpiredException.class,
      () -> jwtTokenProvider.isTokenValid(jwtTokenProvider.getDecodedJWT(finalToken)));
  }

  @Test
  void getAuthentication() {
    User user = User.builder().setRandomUUID().username(randomAlphanumeric(8)).email("email@localhost").build();
    UserPrincipal userPrincipal = UserPrincipal.builder().user(user).build();
    String token = jwtTokenProvider.generateToken(userPrincipal);

    Authentication authentication = jwtTokenProvider.getAuthentication(jwtTokenProvider.getDecodedJWT(token),
      mock(HttpServletRequest.class));

    assertThat(authentication).isNotNull();
    assertEquals(((ContextUser) authentication.getPrincipal()).getUsername(), user.getUsername());
    assertEquals(((ContextUser) authentication.getPrincipal()).getId(), user.getId());
  }

  @Test
  void getUsernamePasswordAuthenticationToken() {
    Authority authority1 = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    Authority authority2 = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    Role role = Role.builder()
      .setRandomUUID()
      .name(randomAlphanumeric(8))
      .authorities(newHashSet(authority1, authority2))
      .build();
    User user = User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .role(role)
      .authorities(role.getAuthorities())
      .build();
    UserPrincipal userPrincipal = new UserPrincipal(user);
    var token = jwtTokenProvider.generateToken(userPrincipal);
    DecodedJWT decoded = jwtTokenProvider.getDecodedJWT(token);

    UsernamePasswordAuthenticationToken actual = jwtTokenProvider.getUsernamePasswordAuthenticationToken(decoded);

    assertThat(actual).isNotNull();
    assertThat(actual.getPrincipal()).isOfAnyClassIn(ContextUser.class)
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("id", user.getId());
    assertThat(actual.getCredentials()).isNull();
    assertThat(actual.isAuthenticated()).isTrue();
    assertThat(actual.getAuthorities()
      .stream()
      .map(GrantedAuthority::getAuthority)
      .collect(Collectors.toUnmodifiableList())
      .containsAll(newHashSet(authority1.getName(), authority2.getName()))).isTrue();
  }
}
