package dev.kurama.api.core.exception.domain.not.found;

public class EmailNotFoundException extends EntityNotFoundException {

  public EmailNotFoundException(String message) {
    super(message);
  }
}
