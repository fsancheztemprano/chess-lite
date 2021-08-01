package dev.kurama.chess.backend.auth.exception.domain;

public class RoleNotFoundException extends Exception {

  public RoleNotFoundException(String message) {
    super(message);
  }
}
