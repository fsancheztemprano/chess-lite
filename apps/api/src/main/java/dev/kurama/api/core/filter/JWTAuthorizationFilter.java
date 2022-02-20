package dev.kurama.api.core.filter;

import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpStatus.OK;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.net.HttpHeaders;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.utility.JWTTokenProvider;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Flogger
@Component
@RequiredArgsConstructor
public class JWTAuthorizationFilter extends OncePerRequestFilter {

  @NonNull
  private final JWTTokenProvider jwtTokenProvider;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException {
    if (request.getMethod().equalsIgnoreCase(OPTIONS.toString())) {
      response.setStatus(OK.value());
    } else {
      String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
      if (authorizationHeader == null || isEmpty(authorizationHeader) || !authorizationHeader.startsWith(
        SecurityConstant.TOKEN_PREFIX)) {
        filterChain.doFilter(request, response);
        return;
      }
      var token = authorizationHeader.substring(SecurityConstant.TOKEN_PREFIX.length());
      DecodedJWT decodedToken = jwtTokenProvider.getDecodedJWT(token);
      if (jwtTokenProvider.isTokenValid(decodedToken)) {
        Authentication authentication = jwtTokenProvider.getAuthentication(decodedToken, request);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } else {
        SecurityContextHolder.clearContext();
      }
    }
    filterChain.doFilter(request, response);
  }
}
