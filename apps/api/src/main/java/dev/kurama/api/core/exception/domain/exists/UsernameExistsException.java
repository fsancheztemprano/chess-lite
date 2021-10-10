package dev.kurama.api.core.exception.domain.exists;

public class UsernameExistsException extends EntityExistsException {

  public UsernameExistsException(String username) {
    super(username);
  }
}

