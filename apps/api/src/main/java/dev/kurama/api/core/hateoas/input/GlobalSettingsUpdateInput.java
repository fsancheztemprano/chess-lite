package dev.kurama.api.core.hateoas.input;

import java.util.Set;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GlobalSettingsUpdateInput {

  private Boolean signupOpen;
  private String defaultRoleId;
  private Set<String> roleIdsThatCanLogin;

}
