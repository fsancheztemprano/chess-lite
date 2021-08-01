package dev.kurama.chess.backend.auth.api.domain.relations;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AdministrationRelations {

  public static final String USER_MANAGEMENT_ROOT_REL = "user-management";
  public static final String ADMINISTRATION_REL = "administration";
}
