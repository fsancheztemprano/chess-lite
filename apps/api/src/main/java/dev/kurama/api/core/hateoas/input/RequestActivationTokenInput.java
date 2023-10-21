package dev.kurama.api.core.hateoas.input;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
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
