package dev.kurama.api.core.exception.domain.not.found;

public class UserNotFoundException extends EntityNotFoundException {

  public UserNotFoundException(String message) {
    super(message);
  }
}
