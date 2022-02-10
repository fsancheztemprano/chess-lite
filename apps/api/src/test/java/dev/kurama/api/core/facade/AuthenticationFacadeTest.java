package dev.kurama.api.core.facade;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
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
import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import java.util.Objects;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@ExtendWith(MockitoExtension.class)
class AuthenticationFacadeTest {

  @InjectMocks
  private AuthenticationFacade authenticationFacade;

  @Mock
  private UserService userService;

  @Mock
  private UserMapper userMapper;

  @Mock
  private AuthenticationManager authenticationManager;

  @Mock
  private JWTTokenProvider jwtTokenProvider;


  @Test
  void signup_should_call_user_service_signup()
    throws UsernameExistsException, EmailExistsException, SignupClosedException {
    SignupInput input = SignupInput.builder().username("username").email("test@example.com").firstname("firstname")
      .lastname("lastname").build();

    authenticationFacade.signup(input);

    verify(userService).signup(input);
  }

  @Test
  void login_should_return_authenticated_user_excerpt() throws RoleCanNotLoginException {
    String testToken = "test_token";
    LoginInput loginInput = LoginInput.builder().username("username").password("password").build();
    Role role = Role.builder().canLogin(true).build();
    User user = User.builder().username(loginInput.getUsername()).role(role).locked(false).build();
    UserModel userModel = UserModel.builder().username(loginInput.getUsername()).role(RoleModel.builder().build())
      .locked(false).build();
    when(userService.findUserByUsername(loginInput.getUsername())).thenReturn(Optional.ofNullable(user));
    when(userMapper.userToUserModel(user)).thenReturn(userModel);
    when(jwtTokenProvider.generateJWTToken(any(UserPrincipal.class))).thenReturn(testToken);

    AuthenticatedUserExcerpt authenticatedUserExcerpt = authenticationFacade.login(loginInput);

    verify(authenticationManager).authenticate(
      new UsernamePasswordAuthenticationToken(loginInput.getUsername(), loginInput.getPassword()));
    verify(jwtTokenProvider, times(2)).generateJWTToken(any(UserPrincipal.class));
    verify(jwtTokenProvider).getDecodedJWT(anyString());
    assertThat(authenticatedUserExcerpt).isNotNull().hasFieldOrPropertyWithValue("userModel", userModel);
    assertThat(Objects.requireNonNull(authenticatedUserExcerpt.getHeaders().get(SecurityConstant.JWT_TOKEN_HEADER))
      .get(0)).isEqualTo(testToken);
  }

  @Test()
  void login_should_throw_if_user_is_locked() {
    LoginInput loginInput = LoginInput.builder().username("username").password("password").build();
    Role role = Role.builder().canLogin(true).build();
    User user = User.builder().username(loginInput.getUsername()).role(role).locked(true).build();
    when(userService.findUserByUsername(user.getUsername())).thenReturn(Optional.of(user));

    assertThrows(LockedException.class, () -> {
      authenticationFacade.login(loginInput);
    });
  }

  @Test
  void login_should_throw_if_role_can_not_login() {
    LoginInput loginInput = LoginInput.builder().username("username").password("password").build();
    Role role = Role.builder().canLogin(false).build();
    User user = User.builder().username(loginInput.getUsername()).role(role).locked(false).build();
    when(userService.findUserByUsername(user.getUsername())).thenReturn(Optional.of(user));

    assertThrows(RoleCanNotLoginException.class, () -> {
      authenticationFacade.login(loginInput);
    });
  }

  @Test
  void request_activation_token_should_call_service() throws EmailNotFoundException, ActivationTokenRecentException {
    String email = "email@example.com";

    authenticationFacade.requestActivationToken(email);

    verify(userService).requestActivationTokenByEmail(email);
  }

  @Test
  void activate_account_should_call_service()
    throws EmailNotFoundException, ActivationTokenExpiredException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException {
    AccountActivationInput input = AccountActivationInput.builder().email("email@example.com").password("password")
      .token("test_token").build();

    authenticationFacade.activateAccount(input);

    verify(userService).activateAccount(input);
  }
}
