package dev.kurama.api.core.exception.domain.exists;

import dev.kurama.api.core.exception.domain.EntityException;

public class EntityExistsException extends EntityException {

  public EntityExistsException(String message, Class<?> entityClass) {
    super(message, entityClass);
  }
}
