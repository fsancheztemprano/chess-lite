package dev.kurama.chess.backend.exception.domain;

public class EmailExistsException extends Exception {

  public EmailExistsException(String message) {
    super(message);
  }
}
