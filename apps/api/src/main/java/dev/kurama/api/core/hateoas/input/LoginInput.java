package dev.kurama.api.core.hateoas.input;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.springframework.validation.annotation.Validated;

@Data
@Builder
@Validated
public class LoginInput {

  @NonNull
  @NotNull
  @Size(min = 5, max = 128)
  private String username;

  @NonNull
  @NotNull
  @Size(min = 6, max = 128)
  private String password;
}
