package dev.kurama.api.core.exception.domain.not.found;

public class UserNotFoundException extends DomainEntityNotFoundException {

  public UserNotFoundException(String message) {
    super(message);
  }
}
