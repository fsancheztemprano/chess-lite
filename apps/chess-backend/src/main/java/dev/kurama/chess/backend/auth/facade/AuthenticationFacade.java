package dev.kurama.chess.backend.auth.facade;

import static dev.kurama.chess.backend.auth.constant.SecurityConstant.JWT_TOKEN_HEADER;

import dev.kurama.chess.backend.auth.api.domain.input.LoginInput;
import dev.kurama.chess.backend.auth.api.domain.input.RegistryInput;
import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.api.mapper.UserMapper;
import dev.kurama.chess.backend.auth.domain.UserPrincipal;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
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
  private final UserMapper userMapper;

  @NonNull
  private final AuthenticationManager authenticationManager;

  @NonNull
  private final JWTTokenProvider jwtTokenProvider;


  public UserModel register(RegistryInput registryInput) throws UsernameExistsException, EmailExistsException {
    var user = userService
      .register(registryInput.getUsername(), registryInput.getPassword(), registryInput.getEmail(),
        registryInput.getFirstName(), registryInput.getLastName());
    return userMapper.userToUserModel(user);
  }

  public HttpHeaders login(LoginInput loginInput) {
    authenticate(loginInput.getUsername(), loginInput.getPassword());
    var user = userService.findUserByUsername(loginInput.getUsername());
    return getJwtHeader(new UserPrincipal(user));
  }


  private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
    var headers = new HttpHeaders();
    headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJWTToken(userPrincipal));
    return headers;
  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }
}
