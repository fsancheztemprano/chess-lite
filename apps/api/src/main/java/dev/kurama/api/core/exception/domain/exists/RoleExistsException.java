package dev.kurama.api.core.exception.domain.exists;

public class RoleExistsException extends EntityExistsException {

  public RoleExistsException(String name) {
    super(name);
  }
}
