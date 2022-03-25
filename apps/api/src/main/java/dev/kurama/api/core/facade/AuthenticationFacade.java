package dev.kurama.api.core.facade;

import static dev.kurama.api.core.utility.HttpUtils.getJwtHeader;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.excerpts.AuthenticatedUserExcerpt;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.UserExistsException;
import dev.kurama.api.core.exception.domain.not.found.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.LoginInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
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

  public void signup(SignupInput signupInput) throws UserExistsException, SignupClosedException {
    userService.signup(signupInput);
  }

  public AuthenticatedUserExcerpt login(LoginInput loginInput) throws RoleCanNotLoginException, UserNotFoundException {
    Pair<User, String> authenticationDetails = authenticationFacility.login(loginInput.getUsername(),
      loginInput.getPassword());

    return AuthenticatedUserExcerpt.builder()
      .userModel(userMapper.userToUserModel(authenticationDetails.getLeft()))
      .headers(getJwtHeader(authenticationDetails.getRight()))
      .build();
  }

  public AuthenticatedUserExcerpt refreshToken(String userId) throws UserNotFoundException, RoleCanNotLoginException {
    Pair<User, String> authenticationDetails = authenticationFacility.refreshToken(userId);

    return AuthenticatedUserExcerpt.builder()
      .userModel(userMapper.userToUserModel(authenticationDetails.getLeft()))
      .headers(getJwtHeader(authenticationDetails.getRight()))
      .build();
  }

  public void requestActivationToken(String email) throws ActivationTokenRecentException, UserNotFoundException {
    userService.requestActivationTokenByEmail(email);
  }

  public void activateAccount(AccountActivationInput accountActivationInput)
    throws ActivationTokenNotFoundException, ActivationTokenUserMismatchException, ActivationTokenExpiredException,
    UserNotFoundException {
    userService.activateAccount(accountActivationInput);
  }
}
