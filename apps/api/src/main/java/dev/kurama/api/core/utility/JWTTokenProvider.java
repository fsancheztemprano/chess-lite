package dev.kurama.api.core.utility;

import static io.micrometer.core.instrument.util.StringUtils.isNotBlank;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.UserPrincipal;
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
      .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.EXPIRATION_TIME))
      .sign(getAlgorithm());
  }

  public List<GrantedAuthority> getAuthorities(String token) {
    return getJWTVerifier().verify(token).getClaim(SecurityConstant.AUTHORITIES).asList(String.class).stream()
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
      verifier = JWT.require(getAlgorithm()).withIssuer(SecurityConstant.AUTH_ISSUER).build();
    } catch (JWTVerificationException exception) {
      throw new JWTVerificationException(SecurityConstant.TOKEN_CANNOT_BE_VERIFIED);
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
