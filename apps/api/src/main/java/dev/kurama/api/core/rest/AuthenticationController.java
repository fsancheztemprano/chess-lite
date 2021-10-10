package dev.kurama.api.core.rest;

import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.DomainEntityNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.EmailNotFoundException;
import dev.kurama.api.core.facade.AuthenticationFacade;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.LoginInput;
import dev.kurama.api.core.hateoas.input.RequestActivationTokenInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
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
@RequestMapping("/api/auth")
@PreAuthorize("!isAuthenticated()")
@RequiredArgsConstructor
public class AuthenticationController {

  @NonNull
  private final AuthenticationFacade authenticationFacade;


  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody SignupInput user)
    throws EmailExistsException, UsernameExistsException, DomainEntityNotFoundException {
    authenticationFacade.signup(user);
    return ok().build();
  }

  @PostMapping("/login")
  public ResponseEntity<UserModel> login(@RequestBody LoginInput user) {
    var authenticatedUser = authenticationFacade.login(user);
    return ok().headers(authenticatedUser.getHeaders())
      .body(authenticatedUser.getUserModel());
  }


  @PostMapping("/token")
  public ResponseEntity<?> requestActivationToken(@RequestBody RequestActivationTokenInput requestActivationTokenInput)
    throws EmailNotFoundException, ActivationTokenRecentException {
    authenticationFacade.requestActivationToken(requestActivationTokenInput.getEmail());
    return ok().build();
  }

  @PostMapping("/activate")
  public ResponseEntity<?> activateAccount(@RequestBody AccountActivationInput accountActivationInput)
    throws EmailNotFoundException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException, ActivationTokenExpiredException {
    authenticationFacade.activateAccount(accountActivationInput);
    return ok().build();
  }
}
