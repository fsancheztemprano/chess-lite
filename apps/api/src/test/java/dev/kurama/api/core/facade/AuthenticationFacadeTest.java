package dev.kurama.api.core.facade;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.constant.SecurityConstant;
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
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import java.util.Objects;
import org.apache.commons.lang3.tuple.Pair;
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
    SignupInput input = SignupInput.builder().username("username").email("test@localhost")
      .firstname("firstname")
      .lastname("lastname")
      .build();

    facade.signup(input);

    verify(userService).signup(input);
  }

  @Test
  void login_should_return_authenticated_user_excerpt() throws RoleCanNotLoginException {
    LoginInput loginInput = LoginInput.builder().username("username").password("password").build();
    User user = User.builder().setRandomUUID().username(loginInput.getUsername()).build();
    String token = "token";
    doReturn(Pair.of(user, token)).when(authenticationFacility)
      .login(loginInput.getUsername(), loginInput.getPassword());
    UserModel userModel = UserModel.builder().username(loginInput.getUsername()).build();
    when(userMapper.userToUserModel(user)).thenReturn(userModel);

    AuthenticatedUserExcerpt authenticatedUserExcerpt = facade.login(loginInput);

    assertThat(authenticatedUserExcerpt).isNotNull().hasFieldOrPropertyWithValue("userModel", userModel);
    assertThat(Objects.requireNonNull(authenticatedUserExcerpt.getHeaders().get(SecurityConstant.JWT_TOKEN_HEADER))
      .get(0)).isEqualTo(token);
  }

  @Test
  void request_activation_token_should_call_service() throws ActivationTokenRecentException, UserNotFoundException {
    String email = "email@localhost";

    facade.requestActivationToken(email);

    verify(userService).requestActivationTokenByEmail(email);
  }

  @Test
  void activate_account_should_call_service()
    throws ActivationTokenExpiredException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException,
    UserNotFoundException {
    AccountActivationInput input = AccountActivationInput.builder().email("email@localhost")
      .password("password")
      .token("test_token")
      .build();

    facade.activateAccount(input);

    verify(userService).activateAccount(input);
  }
}
