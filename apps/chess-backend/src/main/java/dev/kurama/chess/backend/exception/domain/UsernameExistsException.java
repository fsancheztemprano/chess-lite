package dev.kurama.chess.backend.exception.domain;

public class UsernameExistsException extends Exception {

  public UsernameExistsException(String message) {
    super(message);
  }
}
