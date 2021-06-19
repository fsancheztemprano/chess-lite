package dev.kurama.chess.backend.utility;

import static dev.kurama.chess.backend.constant.SecurityConstant.AUTHORITIES;
import static dev.kurama.chess.backend.constant.SecurityConstant.AUTH_AUDIENCE;
import static dev.kurama.chess.backend.constant.SecurityConstant.AUTH_ISSUER;
import static dev.kurama.chess.backend.constant.SecurityConstant.EXPIRATION_TIME;
import static dev.kurama.chess.backend.constant.SecurityConstant.TOKEN_CANNOT_BE_VERIFIED;
import static io.micrometer.core.instrument.util.StringUtils.isNotBlank;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import dev.kurama.chess.backend.domain.UserPrincipal;
import java.util.Date;
import java.util.List;
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

  @Value("${chess.jwt.secret}")
  private String secret;

  public String generateJWTToken(UserPrincipal userPrincipal) {
    String[] authorities = getAuthoritiesFromUser(userPrincipal);

    return JWT.create()
      .withIssuer(AUTH_ISSUER)
      .withAudience(AUTH_AUDIENCE)
      .withIssuedAt(new Date())
      .withSubject(userPrincipal.getUsername())
      .withArrayClaim(AUTHORITIES, authorities)
      .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
      .sign(getAlgorithm());
  }

  public List<GrantedAuthority> getAuthorities(String token) {
    return getJWTVerifier().verify(token).getClaim(AUTHORITIES).asList(String.class).stream()
      .map(SimpleGrantedAuthority::new).collect(
        Collectors.toList());
  }

  public Authentication getAuthentication(String username, List<GrantedAuthority> authorities,
    HttpServletRequest request) {
    var usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    return usernamePasswordAuthenticationToken;
  }

  public boolean isTokenValid(String username, String token) {
    return isNotBlank(username) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    return getJWTVerifier().verify(token).getExpiresAt().before(new Date());
  }

  public String getSubject(String token) {
    return getJWTVerifier().verify(token).getSubject();
  }


  private JWTVerifier getJWTVerifier() {
    JWTVerifier verifier;
    try {
      verifier = JWT.require(getAlgorithm()).withIssuer(AUTH_ISSUER).build();
    } catch (JWTVerificationException exception) {
      throw new JWTVerificationException(TOKEN_CANNOT_BE_VERIFIED);
    }
    return verifier;
  }

  private Algorithm getAlgorithm() {
    return Algorithm.HMAC512(secret);
  }

  private String[] getAuthoritiesFromUser(UserPrincipal userPrincipal) {
    return userPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray(String[]::new);
  }
}
