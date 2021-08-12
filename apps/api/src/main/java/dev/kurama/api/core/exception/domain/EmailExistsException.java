package dev.kurama.api.core.exception.domain;

public class EmailExistsException extends Exception {

  public EmailExistsException(String message) {
    super(message);
  }
}
