package dev.kurama.api.auth.api.domain.input;


import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
public class ChangeUserPasswordInput {

  @NonNull
  @NotNull
  @Length(min = 8, max = 128)
  private String password;

  @NonNull
  @NotNull
  @Length(min = 8, max = 128)
  private String newPassword;
}
