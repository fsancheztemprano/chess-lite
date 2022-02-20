package dev.kurama.api.support;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;

import dev.kurama.api.core.utility.JWTTokenProvider;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.springframework.http.HttpHeaders;

@Builder
@Data
public class MockAuthorizedUser {

  @Builder.Default
  private String id = randomUUID();

  @Builder.Default
  private String username = randomUUID();

  private String[] authorities;

  public MockAuthorizedUser setAuthorities(String... authorities) {
    this.authorities = authorities;
    return this;
  }

  public HttpHeaders getAuthorizationHeader(@NonNull JWTTokenProvider jwtTokenProvider) {
    return TestUtils.getAuthorizationHeader(jwtTokenProvider, this);
  }

  public static class MockAuthorizedUserBuilder {

    public MockAuthorizedUserBuilder authorities(String... authorities) {
      this.authorities = authorities;
      return this;
    }

    public HttpHeaders buildAuthorizationHeader(@NonNull JWTTokenProvider jwtTokenProvider) {
      return this.build().getAuthorizationHeader(jwtTokenProvider);
    }
  }
}
