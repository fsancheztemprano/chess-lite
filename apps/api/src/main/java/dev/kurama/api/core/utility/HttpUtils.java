package dev.kurama.api.core.utility;

import dev.kurama.api.core.constant.SecurityConstant;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class HttpUtils {

  public static HttpHeaders getJwtHeader(String token) {
    return getHeader(SecurityConstant.JWT_TOKEN_HEADER, token);
  }

  private static HttpHeaders getHeader(String name, String token) {
    var headers = new HttpHeaders();
    headers.add(name, token);
    return headers;
  }
}
