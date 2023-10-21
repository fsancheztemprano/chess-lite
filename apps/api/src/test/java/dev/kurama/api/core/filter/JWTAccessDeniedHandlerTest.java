package dev.kurama.api.core.filter;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JWTAccessDeniedHandlerTest {

  JWTAccessDeniedHandler handler;

  @BeforeEach
  void setUp() {
    handler = new JWTAccessDeniedHandler();
  }

  @Test
  void should_handle() throws IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    ServletOutputStream out = mock(ServletOutputStream.class);
    doReturn(out).when(response).getOutputStream();

    handler.handle(request, response, null);

    verify(response).setContentType(APPLICATION_JSON_VALUE);
    verify(response).setStatus(UNAUTHORIZED.value());
    verify(response.getOutputStream()).flush();
  }
}
