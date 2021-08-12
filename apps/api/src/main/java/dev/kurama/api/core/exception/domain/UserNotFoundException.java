package dev.kurama.api.core.exception.domain;

public class UserNotFoundException extends Exception {

  public UserNotFoundException(String message) {
    super(message);
  }
}
