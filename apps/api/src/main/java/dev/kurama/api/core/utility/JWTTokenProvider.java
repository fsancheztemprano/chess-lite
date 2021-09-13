package dev.kurama.api.core.utility;

import static io.micrometer.core.instrument.util.StringUtils.isNotBlank;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.filter.ContextUser;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

@Component
public class JWTTokenProvider {

  @Value("${application.jwt.secret}")
  private String secret;

  public String generateJWTToken(UserPrincipal userPrincipal) {
    String[] authorities = getAuthoritiesFromUser(userPrincipal);

    return JWT.create()
      .withIssuer(SecurityConstant.AUTH_ISSUER)
      .withAudience(SecurityConstant.AUTH_AUDIENCE)
      .withIssuedAt(new Date())
      .withSubject(userPrincipal.getUsername())
      .withArrayClaim(SecurityConstant.AUTHORITIES, authorities)
      .withClaim("user", new HashMap<String, String>() {{
        put("id", userPrincipal.getUser().getId());
        put("username", userPrincipal.getUser().getUsername());
      }})
      .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.EXPIRATION_TIME))
      .sign(getAlgorithm());
  }

  public boolean isTokenValid(String username, String token) {
    return isNotBlank(username) && !isTokenExpired(token);
  }

  public String getSubject(String token) {
    return getJWTVerifier().verify(token).getSubject();
  }

  public Authentication getAuthentication(String token, HttpServletRequest request) {
    List<GrantedAuthority> authorities = getAuthorities(token);
    ContextUser contextUser = getContextUser(token);

    var usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(contextUser, null, authorities);
    if (request != null) {
      usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    }
    return usernamePasswordAuthenticationToken;
  }

  private ContextUser getContextUser(String token) {
    Map<String, Object> user = getJWTVerifier().verify(token).getClaim("user").asMap();
    return ContextUser.builder().id((String) user.get("id")).username((String) user.get("username")).build();
  }

  private JWTVerifier getJWTVerifier() {
    JWTVerifier verifier;
    try {
      verifier = JWT.require(getAlgorithm()).withIssuer(SecurityConstant.AUTH_ISSUER).build();
    } catch (JWTVerificationException exception) {
      throw new JWTVerificationException(SecurityConstant.TOKEN_CANNOT_BE_VERIFIED);
    }
    return verifier;
  }

  private boolean isTokenExpired(String token) {
    return getJWTVerifier().verify(token).getExpiresAt().before(new Date());
  }

  private List<GrantedAuthority> getAuthorities(String token) {
    return getJWTVerifier().verify(token).getClaim(SecurityConstant.AUTHORITIES).asList(String.class).stream()
      .map(SimpleGrantedAuthority::new).collect(
        Collectors.toList());
  }

  private Algorithm getAlgorithm() {
    return Algorithm.HMAC512(secret);
  }

  private String[] getAuthoritiesFromUser(UserPrincipal userPrincipal) {
    return userPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray(String[]::new);
  }
}
