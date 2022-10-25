package dev.kurama.api.core.exception.domain.exists;

import dev.kurama.api.core.domain.Role;

public class RoleExistsException extends EntityExistsException {

  public RoleExistsException(String name) {
    super(name, Role.class);
  }
}
