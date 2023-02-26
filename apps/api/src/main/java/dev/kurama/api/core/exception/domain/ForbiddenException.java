package dev.kurama.api.core.exception.domain;

public class ForbiddenException extends RuntimeException {

  public ForbiddenException(String message) {
    super(message);
  }

}
