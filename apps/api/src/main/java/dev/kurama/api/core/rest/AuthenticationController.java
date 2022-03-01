package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.AUTHENTICATION_PATH;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
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
@RequestMapping(AUTHENTICATION_PATH)
@PreAuthorize("!isAuthenticated()")
@RequiredArgsConstructor
public class AuthenticationController {

  public static final String SIGNUP_PATH = "/signup";
  public static final String LOGIN_PATH = "/login";
  public static final String TOKEN_PATH = "/token";
  public static final String ACTIVATE_PATH = "/activate";

  @NonNull
  private final AuthenticationFacade authenticationFacade;

  @PostMapping(SIGNUP_PATH)
  public ResponseEntity<?> signup(@RequestBody SignupInput user)
    throws EmailExistsException, UsernameExistsException, SignupClosedException {
    authenticationFacade.signup(user);
    return noContent().build();
  }

  @PostMapping(LOGIN_PATH)
  public ResponseEntity<UserModel> login(@RequestBody LoginInput user) throws RoleCanNotLoginException {
    var authenticatedUser = authenticationFacade.login(user);
    return ok().headers(authenticatedUser.getHeaders()).body(authenticatedUser.getUserModel());
  }


  @PostMapping(TOKEN_PATH)
  public ResponseEntity<?> requestActivationToken(@RequestBody RequestActivationTokenInput requestActivationTokenInput)
    throws EmailNotFoundException, ActivationTokenRecentException {
    authenticationFacade.requestActivationToken(requestActivationTokenInput.getEmail());
    return noContent().build();
  }

  @PostMapping(ACTIVATE_PATH)
  public ResponseEntity<?> activateAccount(@RequestBody AccountActivationInput accountActivationInput)
    throws EmailNotFoundException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException,
    ActivationTokenExpiredException {
    authenticationFacade.activateAccount(accountActivationInput);
    return noContent().build();
  }
}
