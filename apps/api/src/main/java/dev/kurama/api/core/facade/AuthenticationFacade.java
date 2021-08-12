package dev.kurama.api.core.facade;

import dev.kurama.api.core.api.domain.input.LoginInput;
import dev.kurama.api.core.api.domain.input.SignupInput;
import dev.kurama.api.core.api.domain.model.AuthenticatedUser;
import dev.kurama.api.core.api.mapper.UserMapper;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.exception.domain.EmailExistsException;
import dev.kurama.api.core.exception.domain.UsernameExistsException;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.core.utility.JWTTokenProvider;
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


  public AuthenticatedUser signup(SignupInput signupInput) throws UsernameExistsException, EmailExistsException {
    var user = userService
      .signup(signupInput.getUsername(), signupInput.getPassword(), signupInput.getEmail(),
        signupInput.getFirstname(), signupInput.getLastname());
    return getAuthenticatedUser(user);
  }

  public AuthenticatedUser login(LoginInput loginInput) {
    authenticate(loginInput.getUsername(), loginInput.getPassword());
    var user = userService.findUserByUsername(loginInput.getUsername())
      .orElseThrow(() -> new UsernameNotFoundException(loginInput.getUsername()));
    return getAuthenticatedUser(user);
  }

  private AuthenticatedUser getAuthenticatedUser(User user) {
    var userModel = userMapper.userToUserModel(user);
    return AuthenticatedUser.builder()
      .userModel(userModel)
      .headers(getJwtHeader(
        new UserPrincipal(user))).build();
  }


  private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
    var headers = new HttpHeaders();
    headers.add(SecurityConstant.JWT_TOKEN_HEADER, jwtTokenProvider.generateJWTToken(userPrincipal));
    return headers;
  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }
}
