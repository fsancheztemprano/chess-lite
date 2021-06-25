package dev.kurama.chess.backend.auth.rest;

import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.auth.domain.User;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.facade.AuthenticationFacade;
import dev.kurama.chess.backend.auth.rest.input.LoginInput;
import dev.kurama.chess.backend.auth.rest.input.RegistryInput;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  @NonNull
  private final AuthenticationFacade authenticationFacade;

  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody RegistryInput user)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return ok().body(authenticationFacade.register(user));
  }

  @PostMapping("/login")
  public ResponseEntity<Void> login(@RequestBody LoginInput user) {
    return ok().headers(authenticationFacade.login(user)).build();
  }
}
