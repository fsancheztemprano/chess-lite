package dev.kurama.chess.backend.auth.rest;

import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.auth.api.assembler.UserModelAssembler;
import dev.kurama.chess.backend.auth.api.domain.input.LoginInput;
import dev.kurama.chess.backend.auth.api.domain.input.SignUpInput;
import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.facade.AuthenticationFacade;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  @NonNull
  private final AuthenticationFacade authenticationFacade;

  @NonNull
  private final UserModelAssembler userModelAssembler;

  @PostMapping("/signup")
  public ResponseEntity<UserModel> signup(@RequestBody SignUpInput user)
    throws UsernameExistsException, EmailExistsException {
    return ok().body(userModelAssembler.toModel(authenticationFacade.signup(user)));
  }

  @PostMapping("/login")
  public ResponseEntity<UserModel> login(@RequestBody LoginInput user) {
    var authenticatedUser = authenticationFacade.login(user);
    return ok().headers(authenticatedUser.getHeaders())
      .body(userModelAssembler.toModel(authenticatedUser.getUserModel()));
  }
}
