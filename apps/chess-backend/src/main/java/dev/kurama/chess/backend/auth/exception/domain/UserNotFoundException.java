package dev.kurama.chess.backend.auth.exception.domain;

public class UserNotFoundException extends Exception {

  public UserNotFoundException(String message) {
    super(message);
  }
}
