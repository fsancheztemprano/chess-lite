package dev.kurama.api.core.exception.domain;

public class UsernameExistsException extends Exception {

  public UsernameExistsException(String message) {
    super(message);
  }
}
