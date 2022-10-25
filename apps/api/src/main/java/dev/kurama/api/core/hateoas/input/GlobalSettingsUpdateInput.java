package dev.kurama.api.core.hateoas.input;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GlobalSettingsUpdateInput {

  private Boolean signupOpen;
  private String defaultRoleId;

}
