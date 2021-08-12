package dev.kurama.api.auth.exception.domain;

public class EmailExistsException extends Exception {

  public EmailExistsException(String message) {
    super(message);
  }
}
