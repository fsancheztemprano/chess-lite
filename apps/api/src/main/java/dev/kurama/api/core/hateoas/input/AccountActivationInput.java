package dev.kurama.api.core.hateoas.input;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
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
