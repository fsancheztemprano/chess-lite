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
public class RoleModel extends RepresentationModel<RoleModel> {

  private String id;
  private String name;
  private Set<AuthorityModel> authorities;
  private boolean isCoreRole;

}
