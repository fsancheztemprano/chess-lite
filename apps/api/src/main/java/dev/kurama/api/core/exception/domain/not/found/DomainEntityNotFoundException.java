package dev.kurama.api.core.exception.domain.not.found;

import static java.lang.String.format;

public class DomainEntityNotFoundException extends Exception {

  public DomainEntityNotFoundException(String message) {
    super(message);
  }

  public DomainEntityNotFoundException(String message, Class<?> clazz) {
    super(format("%s - %s", clazz, message));
  }
}
