package dev.kurama.api.core.utility;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import dev.kurama.api.core.constant.SecurityConstant;
import java.util.Objects;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class HttpUtilsTest {

  @Test
  void should_return_headers_with_bearer_token() {
    String token = randomUUID();
    HttpHeaders jwtHeader = HttpUtils.getJwtHeaders(token);

    assertEquals(Objects.requireNonNull(jwtHeader.get(SecurityConstant.JWT_TOKEN_HEADER)).get(0), token);
    assertEquals(Objects.requireNonNull(jwtHeader.get(SecurityConstant.ACCESS_CONTROL_EXPOSE_HEADERS)).get(0),
      SecurityConstant.JWT_TOKEN_HEADER);
  }

  @Test
  void should_return_headers_with_bearer_and_refresh_token() {
    String token = randomUUID();
    String refreshToken = randomUUID();
    HttpHeaders jwtHeader = HttpUtils.getJwtHeaders(token, refreshToken);

    assertEquals(Objects.requireNonNull(jwtHeader.get(SecurityConstant.JWT_TOKEN_HEADER)).get(0), token);
    assertEquals(Objects.requireNonNull(jwtHeader.get(SecurityConstant.JWT_REFRESH_TOKEN_HEADER)).get(0), refreshToken);
    assertThat(Objects.requireNonNull(jwtHeader.get(SecurityConstant.ACCESS_CONTROL_EXPOSE_HEADERS)).get(0)).contains(
      SecurityConstant.JWT_TOKEN_HEADER, SecurityConstant.JWT_REFRESH_TOKEN_HEADER);
  }
}
