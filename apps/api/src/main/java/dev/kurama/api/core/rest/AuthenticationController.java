package dev.kurama.api.core.rest;

import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.exception.domain.EmailExistsException;
import dev.kurama.api.core.exception.domain.UsernameExistsException;
import dev.kurama.api.core.facade.AuthenticationFacade;
import dev.kurama.api.core.hateoas.assembler.UserModelAssembler;
import dev.kurama.api.core.hateoas.input.LoginInput;
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

  @NonNull
  private final UserModelAssembler userModelAssembler;

  @PostMapping("/signup")
  public ResponseEntity<UserModel> signup(@RequestBody SignupInput user)
    throws UsernameExistsException, EmailExistsException {
    var authenticatedUser = authenticationFacade.signup(user);
    return ok().headers(authenticatedUser.getHeaders())
      .body(userModelAssembler.toModel(authenticatedUser.getUserModel()));
  }

  @PostMapping("/login")
  public ResponseEntity<UserModel> login(@RequestBody LoginInput user) {
    var authenticatedUser = authenticationFacade.login(user);
    return ok().headers(authenticatedUser.getHeaders())
      .body(userModelAssembler.toModel(authenticatedUser.getUserModel()));
  }
}
