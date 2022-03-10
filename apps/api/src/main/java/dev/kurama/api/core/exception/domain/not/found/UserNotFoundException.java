package dev.kurama.api.core.exception.domain.not.found;

import dev.kurama.api.core.domain.User;

public class UserNotFoundException extends EntityNotFoundException {

  public UserNotFoundException(String message) {
    super(message, User.class);
  }

}
