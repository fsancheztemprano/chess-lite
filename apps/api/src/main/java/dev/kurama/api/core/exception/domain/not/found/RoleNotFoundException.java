package dev.kurama.api.core.exception.domain.not.found;

public class RoleNotFoundException extends DomainEntityNotFoundException {

  public RoleNotFoundException(String message) {
    super(message);
  }
}
