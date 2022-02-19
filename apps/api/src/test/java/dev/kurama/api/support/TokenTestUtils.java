package dev.kurama.api.support;

import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.utility.JWTTokenProvider;
import java.util.Arrays;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpHeaders;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TokenTestUtils {

  public static HttpHeaders getAuthorizationHeader(JWTTokenProvider jwtTokenProvider, String... authorizations) {
    return getAuthorizationHeader(jwtTokenProvider, MockAuthorizedUser.builder().authorities(authorizations).build());
  }

  public static HttpHeaders getAuthorizationHeader(@NonNull JWTTokenProvider jwtTokenProvider,
                                                   @NonNull MockAuthorizedUser authorizedUser) {
    HttpHeaders httpHeaders = new HttpHeaders();
    UserPrincipal userPrincipal = UserPrincipal.builder()
      .user(User.builder()
        .id(authorizedUser.getId())
        .username(authorizedUser.getUsername())
        .authorities(Arrays.stream(authorizedUser.getAuthorities())
          .map(authorization -> Authority.builder().setRandomUUID().name(authorization).build())
          .collect(Collectors.toSet()))
        .build())
      .build();
    String token = jwtTokenProvider.generateJWTToken(userPrincipal);

    httpHeaders.add(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX + token);
    return httpHeaders;
  }

}
