package dev.kurama.api.core.facade;

import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.excerpts.AuthenticatedUserExcerpt;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.EmailNotFoundException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.LoginInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationFacade {

  @NonNull
  private final AuthenticationFacility authenticationFacility;

  @NonNull
  private final UserService userService;

  @NonNull
  private final UserMapper userMapper;

  public void signup(SignupInput signupInput)
    throws UsernameExistsException, EmailExistsException, SignupClosedException {
    userService.signup(signupInput);
  }

  public AuthenticatedUserExcerpt login(LoginInput loginInput) throws RoleCanNotLoginException {
    Pair<User, String> authenticationInfo = authenticationFacility.login(loginInput.getUsername(),
      loginInput.getPassword());
    return AuthenticatedUserExcerpt.builder()
      .userModel(userMapper.userToUserModel(authenticationInfo.getLeft()))
      .headers(getJwtHeader(authenticationInfo.getRight()))
      .build();
  }

  public void requestActivationToken(String email) throws EmailNotFoundException, ActivationTokenRecentException {
    userService.requestActivationTokenByEmail(email);
  }

  public void activateAccount(AccountActivationInput accountActivationInput)
    throws EmailNotFoundException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException, ActivationTokenExpiredException {
    userService.activateAccount(accountActivationInput);
  }


  private HttpHeaders getJwtHeader(String token) {
    var headers = new HttpHeaders();
    headers.add(SecurityConstant.JWT_TOKEN_HEADER, token);
    return headers;
  }

}
