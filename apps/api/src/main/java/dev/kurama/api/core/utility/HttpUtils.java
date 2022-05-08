package dev.kurama.api.core.utility;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.constant.SecurityConstant.JWT_REFRESH_TOKEN_HEADER;
import static dev.kurama.api.core.constant.SecurityConstant.JWT_TOKEN_HEADER;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.Nullable;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class HttpUtils {

  public static HttpHeaders getJwtHeaders(@NonNull String token, @Nullable String refreshToken) {
    var headers = new HttpHeaders();
    headers.add(JWT_TOKEN_HEADER, token);
    headers.setAccessControlExposeHeaders(newArrayList(JWT_TOKEN_HEADER));
    if (refreshToken != null) {
      headers.add(JWT_REFRESH_TOKEN_HEADER, refreshToken);
      headers.setAccessControlExposeHeaders(newArrayList(JWT_TOKEN_HEADER, JWT_REFRESH_TOKEN_HEADER));
    }
    return headers;
  }

  public static HttpHeaders getJwtHeaders(@NonNull String token) {
    return getJwtHeaders(token, null);
  }
}
