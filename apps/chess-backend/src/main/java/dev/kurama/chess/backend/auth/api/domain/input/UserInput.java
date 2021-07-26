package dev.kurama.chess.backend.auth.api.domain.input;

import dev.kurama.chess.backend.auth.authority.DefaultAuthority;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Builder
@Data
public class UserInput {

  @NonNull
  private String username;
  @NonNull
  private String password;
  @NonNull
  private String email;
  private String firstname;
  private String lastname;
  @Builder.Default
  private String role = DefaultAuthority.DEFAULT_ROLE;
  @Builder.Default
  private boolean active = true;
  @Builder.Default
  private boolean locked = false;
  @Builder.Default
  private boolean expired = false;
  @Builder.Default
  private boolean credentialsExpired = false;
}
