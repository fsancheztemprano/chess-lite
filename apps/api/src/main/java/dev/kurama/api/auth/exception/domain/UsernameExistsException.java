package dev.kurama.api.auth.exception.domain;

public class UsernameExistsException extends Exception {

  public UsernameExistsException(String message) {
    super(message);
  }
}
