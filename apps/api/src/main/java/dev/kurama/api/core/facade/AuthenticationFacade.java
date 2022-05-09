package dev.kurama.api.core.facade;

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
import dev.kurama.api.core.hateoas.model.AuthenticatedUserModel;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
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

  public AuthenticatedUserModel login(LoginInput loginInput) throws RoleCanNotLoginException, UserNotFoundException {
    return userMapper.authenticatedUserToModel(
      authenticationFacility.login(loginInput.getUsername(), loginInput.getPassword()));
  }

  public AuthenticatedUserModel refreshToken(String userId) throws UserNotFoundException, RoleCanNotLoginException {
    return userMapper.authenticatedUserToModel(authenticationFacility.refreshToken(userId));
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
