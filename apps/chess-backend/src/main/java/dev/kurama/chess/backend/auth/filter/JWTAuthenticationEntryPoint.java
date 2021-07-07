package dev.kurama.chess.backend.auth.filter;

import static dev.kurama.chess.backend.auth.constant.SecurityConstant.FORBIDDEN_MESSAGE;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.chess.backend.auth.domain.DomainResponse;
import java.io.IOException;
import java.io.OutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class JWTAuthenticationEntryPoint extends Http403ForbiddenEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException arg2)
    throws IOException {
    var domainResponse = DomainResponse.builder().status(FORBIDDEN).code(FORBIDDEN.value())
      .message(FORBIDDEN_MESSAGE).build();
    response.setContentType(APPLICATION_JSON_VALUE);
    response.setStatus(FORBIDDEN.value());
    OutputStream outputStream = response.getOutputStream();
    var objectMapper = new ObjectMapper();
    objectMapper.writeValue(outputStream, domainResponse);
    outputStream.flush();
  }
}
