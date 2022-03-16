package dev.kurama.api.core.exception.domain.not.found;

import dev.kurama.api.core.domain.Role;

public class RoleNotFoundException extends EntityNotFoundException {

  public RoleNotFoundException(String message) {
    super(message, Role.class);
  }
}
