package dev.kurama.api.core.exception.domain;

import dev.kurama.api.core.domain.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class EntityException extends RuntimeException {

  private Class<?> entityClass = AbstractEntity.class;

  public EntityException(String message) {
    super(message);
  }

  public EntityException(String message, Class<?> entityClass) {
    super(message);
    this.entityClass = entityClass;
  }
}
