package dev.kurama.api.core.facade;

import static dev.kurama.api.core.utility.HttpUtils.getJwtHeaders;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.support.AuthenticatedUser;
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
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import java.util.Objects;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthenticationFacadeTest {

  @InjectMocks
  private AuthenticationFacade facade;

  @Mock
  private UserService userService;

  @Mock
  private AuthenticationFacility authenticationFacility;

  @Mock
  private UserMapper userMapper;

  @Test
  void signup_should_call_user_service_signup() throws UserExistsException, SignupClosedException {
    SignupInput input = SignupInput.builder()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .firstname(randomAlphanumeric(8))
      .lastname(randomAlphanumeric(8))
      .build();

    facade.signup(input);

    verify(userService).signup(input);
  }

  @Test
  void login_should_return_authenticated_user() throws RoleCanNotLoginException, UserNotFoundException {
    LoginInput loginInput = LoginInput.builder()
      .username(randomAlphanumeric(8))
      .password(randomAlphanumeric(8))
      .build();
    User user = User.builder().setRandomUUID().username(loginInput.getUsername()).build();
    String token = randomUUID();
    String refreshToken = randomUUID();
    AuthenticatedUser authenticatedUser = AuthenticatedUser.builder()
      .user(user)
      .token(token)
      .refreshToken(refreshToken)
      .build();
    doReturn(authenticatedUser).when(authenticationFacility).login(loginInput.getUsername(), loginInput.getPassword());
    UserModel userModel = UserModel.builder().username(loginInput.getUsername()).build();
    AuthenticatedUserModel expected = AuthenticatedUserModel.builder()
      .userModel(userModel)
      .headers(getJwtHeaders(token, refreshToken))
      .build();
    when(userMapper.authenticatedUserToModel(authenticatedUser)).thenReturn(expected);

    AuthenticatedUserModel actual = facade.login(loginInput);

    assertThat(actual).isNotNull().hasFieldOrPropertyWithValue("userModel", userModel);
    assertThat(Objects.requireNonNull(actual.getHeaders().get(SecurityConstant.JWT_TOKEN_HEADER)).get(0)).isEqualTo(
      token);
    assertThat(
      Objects.requireNonNull(actual.getHeaders().get(SecurityConstant.JWT_REFRESH_TOKEN_HEADER)).get(0)).isEqualTo(
      refreshToken);
  }

  @Test
  void refresh_token_should_return_authenticated_user() throws RoleCanNotLoginException, UserNotFoundException {
    User user = User.builder().setRandomUUID().username(randomAlphanumeric(8)).build();
    String token = randomUUID();
    String refreshToken = randomUUID();
    AuthenticatedUser authenticatedUser = AuthenticatedUser.builder()
      .user(user)
      .token(token)
      .refreshToken(refreshToken)
      .build();
    doReturn(authenticatedUser).when(authenticationFacility).refreshToken(user.getId());
    UserModel userModel = UserModel.builder().username(user.getUsername()).build();
    AuthenticatedUserModel expected = AuthenticatedUserModel.builder()
      .userModel(userModel)
      .headers(getJwtHeaders(token, refreshToken))
      .build();
    when(userMapper.authenticatedUserToModel(authenticatedUser)).thenReturn(expected);

    AuthenticatedUserModel actual = facade.refreshToken(user.getId());

    assertThat(actual).isNotNull().hasFieldOrPropertyWithValue("userModel", userModel);
    assertThat(Objects.requireNonNull(actual.getHeaders().get(SecurityConstant.JWT_TOKEN_HEADER)).get(0)).isEqualTo(
      token);
    assertThat(
      Objects.requireNonNull(actual.getHeaders().get(SecurityConstant.JWT_REFRESH_TOKEN_HEADER)).get(0)).isEqualTo(
      refreshToken);
  }

  @Test
  void request_activation_token_should_call_service() throws ActivationTokenRecentException, UserNotFoundException {
    String email = randomAlphanumeric(8);

    facade.requestActivationToken(email);

    verify(userService).requestActivationTokenByEmail(email);
  }

  @Test
  void activate_account_should_call_service()
    throws ActivationTokenExpiredException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException,
    UserNotFoundException {
    AccountActivationInput input = AccountActivationInput.builder()
      .email(randomAlphanumeric(8))
      .password(randomAlphanumeric(8))
      .token(randomAlphanumeric(8))
      .build();

    facade.activateAccount(input);

    verify(userService).activateAccount(input);
  }
}
