package dev.kurama.chess.backend.exception.domain;

public class UserNotFoundException extends Exception {

  public UserNotFoundException(String message) {
    super(message);
  }
}
