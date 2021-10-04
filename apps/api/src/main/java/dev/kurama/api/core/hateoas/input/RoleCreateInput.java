package dev.kurama.api.core.hateoas.input;

import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Builder
@Data
public class RoleCreateInput {

  @Length(min = 3, max = 128)
  private String name;
}
