package dev.kurama.api.core.exception.domain.not.found;

public class RoleNotFoundException extends EntityNotFoundException {

  public RoleNotFoundException(String message) {
    super(message);
  }
}
