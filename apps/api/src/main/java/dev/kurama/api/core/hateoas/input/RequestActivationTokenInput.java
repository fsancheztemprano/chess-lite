package dev.kurama.api.core.hateoas.input;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class RequestActivationTokenInput {

  @NonNull
  @NotNull
  @Email
  private String email;

}
