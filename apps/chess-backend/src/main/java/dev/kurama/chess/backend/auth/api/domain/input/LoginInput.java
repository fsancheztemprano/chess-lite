package dev.kurama.chess.backend.auth.api.domain.input;

import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
public class LoginInput {

  @NonNull
  @NotNull
  @Length(min = 5, max = 128)
  private String username;
  @NonNull
  @NotNull
  @Length(min = 6, max = 128)
  private String password;
}
