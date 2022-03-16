package dev.kurama.api.core.utility;

import static dev.kurama.api.core.constant.SecurityConstant.ACCESS_CONTROL_EXPOSE_HEADERS;
import static dev.kurama.api.core.constant.SecurityConstant.JWT_TOKEN_HEADER;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class HttpUtils {

  public static HttpHeaders getJwtHeader(String token) {
    var headers = new HttpHeaders();
    headers.add(JWT_TOKEN_HEADER, token);
    headers.add(ACCESS_CONTROL_EXPOSE_HEADERS, JWT_TOKEN_HEADER);
    return headers;
  }
}
