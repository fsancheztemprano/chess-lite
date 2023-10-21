package dev.kurama.api.core.hateoas.input;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
public class AccountActivationInput {

  @NonNull
  @NotNull
  @Email
  private String email;

  @NonNull
  @NotNull
  @Length(min = 8, max = 128)
  private String token;

  @NonNull
  @NotNull
  @Length(min = 8, max = 128)
  private String password;
}
