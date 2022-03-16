package dev.kurama.api.core.exception.domain.exists;

import dev.kurama.api.core.domain.User;

public class UserExistsException extends EntityExistsException {

  public UserExistsException(String username) {
    super(username, User.class);
  }
}

