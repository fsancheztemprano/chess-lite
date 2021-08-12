package dev.kurama.api.auth.exception.domain;

public class UserNotFoundException extends Exception {

  public UserNotFoundException(String message) {
    super(message);
  }
}
