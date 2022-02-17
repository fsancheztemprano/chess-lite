package dev.kurama.api.core.utility;

import static org.junit.jupiter.api.Assertions.assertEquals;

import dev.kurama.api.core.constant.SecurityConstant;
import java.util.Objects;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class HttpUtilsTest {

  @Test
  void should_return_headers_with_bearer_token() {
    String token = "test.token";
    HttpHeaders jwtHeader = HttpUtils.getJwtHeader(token);

    assertEquals(Objects.requireNonNull(jwtHeader.get(SecurityConstant.JWT_TOKEN_HEADER))
      .get(0), token);
  }
}
