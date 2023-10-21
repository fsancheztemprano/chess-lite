package dev.kurama.api.core.hateoas.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
public class SignupInput {

  @NonNull
  @NotNull
  @Length(min = 5, max = 128)
  private String username;

  @NonNull
  @NotNull
  @Email
  private String email;

  private String firstname;

  private String lastname;

}
