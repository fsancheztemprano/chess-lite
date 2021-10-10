package dev.kurama.api.core.exception.domain.exists;

public class EntityExistsException extends Exception {

  public EntityExistsException(String id) {
    super(id);
  }
}
