package dev.kurama.api.core.exception.domain;

public class ActivationTokenExpiredException extends Exception {

  public ActivationTokenExpiredException(String message) {
    super(message);
  }
}
