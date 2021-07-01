package dev.kurama.chess.backend.auth.facade;

import static dev.kurama.chess.backend.auth.constant.SecurityConstant.JWT_TOKEN_HEADER;

import dev.kurama.chess.backend.auth.api.domain.input.LoginInput;
import dev.kurama.chess.backend.auth.api.domain.input.RegistryInput;
import dev.kurama.chess.backend.auth.domain.User;
import dev.kurama.chess.backend.auth.domain.UserPrincipal;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.service.UserService;
import dev.kurama.chess.backend.auth.utility.JWTTokenProvider;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationFacade {

  @NonNull
  private final UserService userService;

  @NonNull
  private final AuthenticationManager authenticationManager;

  @NonNull
  private final JWTTokenProvider jwtTokenProvider;


  public User register(RegistryInput user)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return userService
      .register(user.getUsername(), user.getPassword(), user.getEmail(), user.getFirstName(), user.getLastName());
  }

  public HttpHeaders login(LoginInput user) {
    authenticate(user.getUsername(), user.getPassword());
    var loginUser = userService.findUserByUsername(user.getUsername());
    return getJwtHeader(new UserPrincipal(loginUser));
  }


  private HttpHeaders getJwtHeader(UserPrincipal user) {
    var headers = new HttpHeaders();
    headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJWTToken(user));
    return headers;
  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }
}
