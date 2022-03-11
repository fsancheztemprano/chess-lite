package dev.kurama.api.core.utility;

import static com.google.common.collect.Sets.newHashSet;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import com.auth0.jwt.interfaces.DecodedJWT;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.filter.ContextUser;
import java.util.Date;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(SpringExtension.class)
class JWTTokenProviderTest {

  @Spy
  @InjectMocks
  private JWTTokenProvider jwtTokenProvider;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(jwtTokenProvider, "secret", "secret");
  }

  @Test
  void generateJWTToken() {
    Authority authority1 = Authority.builder().setRandomUUID().name("authority1").build();
    Authority authority2 = Authority.builder().setRandomUUID().name("authority2").build();
    User user = User.builder()
      .setRandomUUID()
      .username("username")
      .email("email@localhost")
      .authorities(newHashSet(authority1, authority2))
      .build();
    UserPrincipal userPrincipal = UserPrincipal.builder().user(user).build();
    Date before = new Date();
    doReturn(7979512271000L).when(jwtTokenProvider).getCurrentTimeMillis();

    String token = jwtTokenProvider.generateJWTToken(userPrincipal);

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
    assertThat(decoded.getExpiresAt()).hasSameTimeAs(new Date(7979512271000L + SecurityConstant.EXPIRATION_TIME));
  }

  @Test
  void isTokenValid() {
    User user = User.builder().setRandomUUID().username("username").email("email@localhost").build();
    UserPrincipal userPrincipal = UserPrincipal.builder().user(user).build();
    String token = jwtTokenProvider.generateJWTToken(userPrincipal);

    assertTrue(jwtTokenProvider.isTokenValid(jwtTokenProvider.getDecodedJWT(token)));

    doReturn(System.currentTimeMillis() - SecurityConstant.EXPIRATION_TIME).when(jwtTokenProvider)
      .getCurrentTimeMillis();
    token = jwtTokenProvider.generateJWTToken(userPrincipal);

    assertFalse(jwtTokenProvider.isTokenValid(jwtTokenProvider.getDecodedJWT(token)));
  }

  @Test
  void getAuthentication() {
    User user = User.builder().setRandomUUID().username("username").email("email@localhost").build();
    UserPrincipal userPrincipal = UserPrincipal.builder().user(user).build();
    String token = jwtTokenProvider.generateJWTToken(userPrincipal);

    Authentication authentication = jwtTokenProvider.getAuthentication(jwtTokenProvider.getDecodedJWT(token),
      mock(HttpServletRequest.class));

    assertThat(authentication).isNotNull();
    assertEquals(((ContextUser) authentication.getPrincipal()).getUsername(), user.getUsername());
    assertEquals(((ContextUser) authentication.getPrincipal()).getId(), user.getId());
  }

  @Test
  void getUsernamePasswordAuthenticationToken() {
  }
}
