package dev.kurama.api.core.hateoas.input;

import java.util.Set;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Builder
@Data
public class RoleUpdateInput {

  @Length(min = 3, max = 128)
  private String name;
  private Set<String> authorityIds;
  private Boolean canLogin;
}
