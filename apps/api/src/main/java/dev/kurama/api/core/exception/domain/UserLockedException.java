package dev.kurama.api.core.exception.domain;

public class UserLockedException extends Exception {

  public UserLockedException(String message) {
    super(message);
  }
}
