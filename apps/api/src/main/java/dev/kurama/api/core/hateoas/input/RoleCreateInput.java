package dev.kurama.api.core.hateoas.input;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.validator.constraints.Length;

@Builder
@Data
public class RoleCreateInput {

  @NonNull
  @NotNull
  @Length(min = 3, max = 128)
  private String name;
}
