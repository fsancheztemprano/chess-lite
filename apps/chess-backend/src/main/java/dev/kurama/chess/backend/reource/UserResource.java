package dev.kurama.chess.backend.reource;

import static dev.kurama.chess.backend.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.domain.User;
import dev.kurama.chess.backend.domain.UserPrincipal;
import dev.kurama.chess.backend.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.service.UserService;
import dev.kurama.chess.backend.utility.JWTTokenProvider;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = {"/", "/user"})
@RequiredArgsConstructor
public class UserResource {

  @NonNull
  private final UserService userService;

  @NonNull
  private final AuthenticationManager authenticationManager;

  @NonNull
  private final JWTTokenProvider jwtTokenProvider;

  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody User user)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    var newUser = userService.register(user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail());
    return ok().body(newUser);
  }

  @PostMapping("/login")
  public ResponseEntity<User> login(@RequestBody User user) {
    authenticate(user.getUsername(), user.getPassword());
    var loginUser = userService.findUserByUsername(user.getUsername());
    var userPrincipal = new UserPrincipal(loginUser);
    HttpHeaders jstHeader = getJwtHeader(userPrincipal);
    return ok().headers(jstHeader).body(loginUser);
  }

  private HttpHeaders getJwtHeader(UserPrincipal user) {
    HttpHeaders headers = new HttpHeaders();
    headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJWTToken(user));
    return headers;
  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }
}
