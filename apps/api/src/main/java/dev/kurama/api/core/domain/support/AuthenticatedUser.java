package dev.kurama.api.core.domain.support;

import dev.kurama.api.core.domain.User;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class AuthenticatedUser {

  private @NonNull User user;
  private @NonNull String token;
  private String refreshToken;

}
