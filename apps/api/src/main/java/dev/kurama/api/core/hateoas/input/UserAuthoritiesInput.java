package dev.kurama.api.core.hateoas.input;

import java.util.Set;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserAuthoritiesInput {

  private Set<String> authorityIds;
}
