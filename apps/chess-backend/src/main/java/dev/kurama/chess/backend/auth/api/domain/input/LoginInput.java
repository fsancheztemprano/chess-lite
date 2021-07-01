package dev.kurama.chess.backend.auth.api.domain.input;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class LoginInput {

  @NonNull
  private String username;
  @NonNull
  private String password;
}
