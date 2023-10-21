package dev.kurama.api.core.filter;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.DomainResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class JWTAuthenticationEntryPoint extends Http403ForbiddenEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException arg2)
    throws IOException {
    var domainResponse = DomainResponse.builder()
      .reason(FORBIDDEN.getReasonPhrase())
      .status(FORBIDDEN.value())
      .title(SecurityConstant.FORBIDDEN_MESSAGE)
      .build();
    response.setContentType(APPLICATION_JSON_VALUE);
    response.setStatus(FORBIDDEN.value());
    OutputStream outputStream = response.getOutputStream();
    var objectMapper = new ObjectMapper();
    objectMapper.writeValue(outputStream, domainResponse);
    outputStream.flush();
  }
}
