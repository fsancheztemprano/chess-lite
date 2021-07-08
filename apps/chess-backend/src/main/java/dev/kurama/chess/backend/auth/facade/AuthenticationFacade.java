package dev.kurama.chess.backend.auth.facade;

import static dev.kurama.chess.backend.auth.constant.SecurityConstant.JWT_TOKEN_HEADER;

import dev.kurama.chess.backend.auth.api.domain.input.LoginInput;
import dev.kurama.chess.backend.auth.api.domain.input.SignUpInput;
import dev.kurama.chess.backend.auth.api.domain.model.AuthenticatedUser;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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


  public UserModel signup(SignUpInput signUpInput) throws UsernameExistsException, EmailExistsException {
    var user = userService
      .signup(signUpInput.getUsername(), signUpInput.getPassword(), signUpInput.getEmail(),
        signUpInput.getFirstName(), signUpInput.getLastName());
    return userMapper.userToUserModel(user);
  }

  public AuthenticatedUser login(LoginInput loginInput) {
    authenticate(loginInput.getUsername(), loginInput.getPassword());
    var user = userService.findUserByUsername(loginInput.getUsername())
      .orElseThrow(() -> new UsernameNotFoundException(loginInput.getUsername()));
    var userModel = userMapper.userToUserModel(user);
    return AuthenticatedUser.builder()
      .userModel(userModel)
      .headers(getJwtHeader(
        new UserPrincipal(user))).build();
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
