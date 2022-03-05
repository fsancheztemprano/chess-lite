package dev.kurama.api.core.exception.domain;

import dev.kurama.api.core.exception.domain.not.found.DomainEntityNotFoundException;

public class ActivationTokenNotFoundException extends DomainEntityNotFoundException {

  public ActivationTokenNotFoundException(String message) {
    super(message);
  }
}
