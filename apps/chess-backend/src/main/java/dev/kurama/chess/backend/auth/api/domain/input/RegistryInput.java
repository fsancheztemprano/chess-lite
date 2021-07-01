package dev.kurama.chess.backend.auth.api.domain.input;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class RegistryInput {

  @NonNull
  private String username;
  @NonNull
  private String password;
  @NonNull
  private String firstName;
  @NonNull
  private String lastName;
  @NonNull
  private String email;
}
