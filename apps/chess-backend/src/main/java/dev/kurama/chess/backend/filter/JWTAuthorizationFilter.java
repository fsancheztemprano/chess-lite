package dev.kurama.chess.backend.filter;

import static dev.kurama.chess.backend.constant.SecurityConstant.TOKEN_PREFIX;
import static io.micrometer.core.instrument.util.StringUtils.isEmpty;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpStatus.OK;

import com.google.common.net.HttpHeaders;
import dev.kurama.chess.backend.utility.JWTTokenProvider;
import java.io.IOException;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JWTAuthorizationFilter extends OncePerRequestFilter {

  private final JWTTokenProvider jwtTokenProvider;

  public JWTAuthorizationFilter(JWTTokenProvider jwtTokenProvider) {
    this.jwtTokenProvider = jwtTokenProvider;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException {
    if (request.getMethod().equalsIgnoreCase(OPTIONS.toString())) {
      response.setStatus(OK.value());
    } else {
      String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
      if (isEmpty(authorizationHeader) || !authorizationHeader.startsWith(TOKEN_PREFIX)) {
        filterChain.doFilter(request, response);
        return;
      }
      String token = authorizationHeader.substring(TOKEN_PREFIX.length());
      String username = jwtTokenProvider.getSubject(token);
      if (jwtTokenProvider.isTokenValid(username, token)) {
        List<GrantedAuthority> authorities = jwtTokenProvider.getAuthorities(token);
        Authentication authentication = jwtTokenProvider.getAuthentication(username, authorities, request);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } else {
        SecurityContextHolder.clearContext();
      }
    }
    filterChain.doFilter(request, response);
  }
}
