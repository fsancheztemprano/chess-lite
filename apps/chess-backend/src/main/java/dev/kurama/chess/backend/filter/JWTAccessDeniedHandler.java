package dev.kurama.chess.backend.filter;

import static dev.kurama.chess.backend.constant.SecurityConstant.ACCESS_DENIED_MESSAGE;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.chess.backend.domain.DomainResponse;
import java.io.IOException;
import java.io.OutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class JWTAccessDeniedHandler implements AccessDeniedHandler {

  @Override
  public void handle(
    HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception) throws IOException {
    DomainResponse domainResponse = DomainResponse.builder().status(UNAUTHORIZED).code(UNAUTHORIZED.value())
      .message(ACCESS_DENIED_MESSAGE).build();
    response.setContentType(APPLICATION_JSON_VALUE);
    response.setStatus(UNAUTHORIZED.value());
    OutputStream outputStream = response.getOutputStream();
    var mapper = new ObjectMapper();
    mapper.writeValue(outputStream, domainResponse);
    outputStream.flush();
  }
}
