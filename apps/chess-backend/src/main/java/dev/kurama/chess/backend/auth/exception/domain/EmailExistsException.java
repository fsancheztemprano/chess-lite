package dev.kurama.chess.backend.auth.exception.domain;

public class EmailExistsException extends Exception {

  public EmailExistsException(String message) {
    super(message);
  }
}
