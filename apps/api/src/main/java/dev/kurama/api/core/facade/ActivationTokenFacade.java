package dev.kurama.api.core.facade;

import dev.kurama.api.core.exception.domain.ActivationTokenEmailMismatchException;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.EmailNotFoundException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.service.ActivationTokenService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActivationTokenFacade {

  @NonNull
  private final ActivationTokenService activationTokenService;


  public void sendActivationToken(String email) throws EmailNotFoundException, ActivationTokenRecentException {
    activationTokenService.sendActivationToken(email);
  }

  public void activateAccount(AccountActivationInput accountActivationInput)
    throws EmailNotFoundException, ActivationTokenNotFoundException, ActivationTokenEmailMismatchException, ActivationTokenExpiredException {
    activationTokenService.activateAccount(accountActivationInput);
  }
}
