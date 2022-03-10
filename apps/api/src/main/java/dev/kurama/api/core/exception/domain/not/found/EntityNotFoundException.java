package dev.kurama.api.core.exception.domain.not.found;

import dev.kurama.api.core.exception.domain.EntityException;

public class EntityNotFoundException extends EntityException {

  public EntityNotFoundException(String message, Class<?> entityClass) {
    super(message, entityClass);
  }
}
