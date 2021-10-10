package dev.kurama.api.core.exception.domain.exists;

public class EmailExistsException extends EntityExistsException {

  public EmailExistsException(String email) {
    super(email);
  }
}
