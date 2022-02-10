package dev.kurama.api.core.filter;

import static org.assertj.core.util.Lists.newArrayList;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpStatus.OK;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.net.HttpHeaders;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.utility.JWTTokenProvider;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class JWTAuthorizationFilterTest {

  @InjectMocks
  private JWTAuthorizationFilter filter;
  @Mock
  private JWTTokenProvider jwtTokenProvider;

  @Test
  void should_set_status_ok_on_options_method() throws ServletException, IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);

    doReturn(OPTIONS.toString()).when(request)
                                .getMethod();

    filter.doFilterInternal(request, response, filterChain);

    verify(response).setStatus(OK.value());
    verify(filterChain).doFilter(request, response);
    verifyNoInteractions(jwtTokenProvider);
  }

  @Test
  void should_filter_on_invalid_token_header_requests() throws ServletException, IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);
    ArrayList<String> invalidTokens = newArrayList(null, "", "Borrer");
    doReturn(GET.toString()).when(request)
                            .getMethod();

    for (String token : invalidTokens) {
      doReturn(token).when(request)
                     .getHeader(HttpHeaders.AUTHORIZATION);

      filter.doFilterInternal(request, response, filterChain);
    }

    verifyNoInteractions(jwtTokenProvider);
  }

  @Test
  void should_set_context_on_valid_token() throws ServletException, IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);
    doReturn(GET.toString()).when(request)
                            .getMethod();
    String token = "token";
    DecodedJWT decodedToken = mock(DecodedJWT.class);
    doReturn(SecurityConstant.TOKEN_PREFIX + token).when(request)
                                                   .getHeader(HttpHeaders.AUTHORIZATION);
    doReturn(decodedToken).when(jwtTokenProvider)
                          .getDecodedJWT(token);
    doReturn(true).when(jwtTokenProvider)
                  .isTokenValid(decodedToken);
    Authentication authentication = mock(Authentication.class);
    doReturn(authentication).when(jwtTokenProvider)
                            .getAuthentication(decodedToken, request);
    SecurityContext securityContext = Mockito.mock(SecurityContext.class);
    SecurityContextHolder.setContext(securityContext);

    filter.doFilterInternal(request, response, filterChain);

    verify(securityContext).setAuthentication(authentication);
  }

  @Test
  void should_clear_context_on_invalid_token() throws ServletException, IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);
    doReturn(GET.toString()).when(request)
                            .getMethod();
    String token = "token";
    DecodedJWT decodedToken = mock(DecodedJWT.class);
    doReturn(SecurityConstant.TOKEN_PREFIX + token).when(request)
                                                   .getHeader(HttpHeaders.AUTHORIZATION);
    doReturn(decodedToken).when(jwtTokenProvider)
                          .getDecodedJWT(token);
    doReturn(false).when(jwtTokenProvider)
                   .isTokenValid(decodedToken);

    try (MockedStatic<SecurityContextHolder> utilities = Mockito.mockStatic(SecurityContextHolder.class)) {

      filter.doFilterInternal(request, response, filterChain);
      utilities.verify(() -> SecurityContextHolder.clearContext());
    }
  }
}
