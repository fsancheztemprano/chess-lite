package dev.kurama.api.core.filter;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JWTAuthenticationEntryPointTest {

  JWTAuthenticationEntryPoint handler;

  @BeforeEach
  void setUp() {
    handler = new JWTAuthenticationEntryPoint();
  }

  @Test
  void should_commence() throws IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    ServletOutputStream out = mock(ServletOutputStream.class);
    doReturn(out).when(response).getOutputStream();
    handler.commence(request, response, null);

    verify(response).setContentType(APPLICATION_JSON_VALUE);
    verify(response).setStatus(FORBIDDEN.value());
    verify(response.getOutputStream()).flush();
  }
}
