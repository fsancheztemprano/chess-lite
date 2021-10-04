package dev.kurama.api.core.exception.domain.not.found;

public class EmailNotFoundException extends DomainEntityNotFoundException {

  public EmailNotFoundException(String message) {
    super(message);
  }
}
