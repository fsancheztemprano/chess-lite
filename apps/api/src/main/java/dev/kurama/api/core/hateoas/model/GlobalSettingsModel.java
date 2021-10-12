package dev.kurama.api.core.hateoas.model;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GlobalSettingsModel extends RepresentationModel<GlobalSettingsModel> {

  private boolean signupOpen;
  private RoleModel defaultRole;
  private Set<RoleModel> rolesThatCanLogin;

}
