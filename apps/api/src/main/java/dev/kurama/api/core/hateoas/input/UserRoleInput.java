package dev.kurama.api.core.hateoas.input;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserRoleInput {

  private String roleId;
}
