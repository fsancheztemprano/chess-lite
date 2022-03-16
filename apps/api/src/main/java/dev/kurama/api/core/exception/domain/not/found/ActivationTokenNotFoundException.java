package dev.kurama.api.core.exception.domain.not.found;

import dev.kurama.api.core.domain.ActivationToken;

public class ActivationTokenNotFoundException extends EntityNotFoundException {

  public ActivationTokenNotFoundException(String message) {
    super(message, ActivationToken.class);
  }
}
