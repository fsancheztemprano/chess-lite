package dev.kurama.chess.backend.auth.exception.domain;

public class UsernameExistsException extends Exception {

  public UsernameExistsException(String message) {
    super(message);
  }
}
