package dev.kurama.api.core.utility;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.base.Strings;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.filter.ContextUser;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
  private String SECRET;

  @Value("${application.jwt.token_life}")
  private long TOKEN_LIFE_SPAN;

  @Value("${application.jwt.refresh_life}")
  private long REFRESH_TOKEN_LIFE_SPAN;

  public String generateToken(UserPrincipal userPrincipal) {
    return generateJwtToken(userPrincipal, TOKEN_LIFE_SPAN);
  }

  public String generateRefreshToken(UserPrincipal userPrincipal) {
    return generateJwtToken(userPrincipal, REFRESH_TOKEN_LIFE_SPAN);
  }

  public boolean isTokenValid(DecodedJWT token) {
    return !Strings.isNullOrEmpty(token.getSubject()) && !isTokenExpired(token);
  }

  public DecodedJWT getDecodedJWT(String token) {
    return getJWTVerifier().verify(token);
  }

  public Authentication getAuthentication(DecodedJWT token, HttpServletRequest request) {
    UsernamePasswordAuthenticationToken authenticationToken = getUsernamePasswordAuthenticationToken(token);
    if (request != null) {
      authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    }
    return authenticationToken;
  }

  public UsernamePasswordAuthenticationToken getUsernamePasswordAuthenticationToken(DecodedJWT token) {
    List<GrantedAuthority> authorities = getAuthorities(token);
    ContextUser contextUser = getContextUser(token);

    return new UsernamePasswordAuthenticationToken(contextUser, null, authorities);
  }

  private String generateJwtToken(UserPrincipal userPrincipal, long lifeSpan) {
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
      .withExpiresAt(new Date(getCurrentTimeMillis() + lifeSpan))
      .sign(getAlgorithm());
  }

  private ContextUser getContextUser(DecodedJWT token) {
    Map<String, Object> user = token.getClaim("user").asMap();
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

  private boolean isTokenExpired(DecodedJWT token) {
    return token.getExpiresAt().before(new Date());
  }

  private List<GrantedAuthority> getAuthorities(DecodedJWT token) {
    return token.getClaim(SecurityConstant.AUTHORITIES)
      .asList(String.class)
      .stream()
      .map(SimpleGrantedAuthority::new)
      .collect(Collectors.toList());
  }

  private Algorithm getAlgorithm() {
    return Algorithm.HMAC512(SECRET);
  }

  private String[] getAuthoritiesFromUser(UserPrincipal userPrincipal) {
    return userPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray(String[]::new);
  }

  public long getCurrentTimeMillis() {
    return System.currentTimeMillis();
  }
}
