package dev.kurama.api.core.facade;

import com.auth0.jwt.interfaces.DecodedJWT;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.domain.excerpts.AuthenticatedUserExcerpt;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.EmailNotFoundException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.LoginInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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

  public void signup(SignupInput signupInput)
    throws UsernameExistsException, EmailExistsException {
    userService.signup(signupInput);
  }

  public AuthenticatedUserExcerpt login(LoginInput loginInput) {
    authenticate(loginInput.getUsername(), loginInput.getPassword());
    var user = userService.findUserByUsername(loginInput.getUsername())
      .orElseThrow(() -> new UsernameNotFoundException(loginInput.getUsername()));
    if (user.isLocked()) {
      throw new LockedException(loginInput.getUsername());
    }
    return authenticateUser(user);
  }

  public void requestActivationToken(String email) throws EmailNotFoundException, ActivationTokenRecentException {
    userService.requestActivationTokenByEmail(email);
  }

  public void activateAccount(AccountActivationInput accountActivationInput)
    throws EmailNotFoundException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException, ActivationTokenExpiredException {
    userService.activateAccount(accountActivationInput);
  }

  private AuthenticatedUserExcerpt authenticateUser(User user) {
    UserPrincipal userPrincipal = new UserPrincipal(user);
    var token = jwtTokenProvider.generateJWTToken(userPrincipal);
    DecodedJWT decodedToken = jwtTokenProvider.getDecodedJWT(token);
    SecurityContextHolder.getContext().setAuthentication(jwtTokenProvider.getAuthentication(decodedToken, null));

    return AuthenticatedUserExcerpt.builder()
      .userModel(userMapper.userToUserModel(user))
      .headers(getJwtHeader(new UserPrincipal(user)))
      .build();
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
