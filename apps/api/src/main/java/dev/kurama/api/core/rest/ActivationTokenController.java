package dev.kurama.api.core.rest;

import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.exception.domain.ActivationTokenEmailMismatchException;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.EmailNotFoundException;
import dev.kurama.api.core.facade.ActivationTokenFacade;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.RequestActivationTokenInput;
import dev.kurama.api.core.hateoas.model.UserModel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activation")
@PreAuthorize("!isAuthenticated()")
@RequiredArgsConstructor
public class ActivationTokenController {

  @NonNull
  private final ActivationTokenFacade activationTokenFacade;

  @PostMapping("/token")
  public ResponseEntity<?> requestActivationToken(@RequestBody RequestActivationTokenInput requestActivationTokenInput)
    throws EmailNotFoundException, ActivationTokenRecentException {
    activationTokenFacade.sendActivationToken(requestActivationTokenInput.getEmail());
    return ok().build();
  }

  @PostMapping("/activate")
  public ResponseEntity<UserModel> activateAccount(@RequestBody AccountActivationInput accountActivationInput)
    throws EmailNotFoundException, ActivationTokenNotFoundException, ActivationTokenEmailMismatchException, ActivationTokenExpiredException {
    activationTokenFacade.activateAccount(accountActivationInput);
    return ok().build();
  }
}
