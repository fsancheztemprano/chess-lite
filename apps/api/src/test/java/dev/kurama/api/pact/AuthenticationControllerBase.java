package dev.kurama.api.pact;

import static com.google.common.collect.Sets.newHashSet;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.exception.domain.exists.UserExistsException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.facade.AuthenticationFacade;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.processor.UserModelProcessor;
import dev.kurama.api.core.hateoas.processor.UserPreferencesModelProcessor;
import dev.kurama.api.core.rest.AuthenticationController;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.support.ImportMappers;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationManager;

@WebMvcTest(controllers = AuthenticationController.class)
@Import({AuthenticationFacade.class, UserModelProcessor.class, UserPreferencesModelProcessor.class,
  AuthenticationFacility.class, JWTTokenProvider.class})
@ImportMappers
public abstract class AuthenticationControllerBase extends PactBase {

  @MockBean
  private UserService userService;

  @MockBean
  private AuthenticationManager authenticationManager;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();
    HashSet<Authority> authorities = newHashSet(Authority.builder().setRandomUUID().name("profile:read").build(),
      Authority.builder().setRandomUUID().name("profile:update").build(),
      Authority.builder().setRandomUUID().name("profile:delete").build());
    Role pactRole = Role.builder()
      .id("pactRoleId")
      .name("PACT_ROLE")
      .coreRole(false)
      .canLogin(true)
      .authorities(authorities)
      .build();
    User pactUser = User.builder()
      .id("pactUserId")
      .username("pactUser")
      .email("pactUser@localhost")
      .joinDate(new Date())
      .role(pactRole)
      .authorities(authorities)
      .active(true)
      .locked(false)
      .expired(false)
      .credentialsExpired(false)
      .userPreferences(UserPreferences.builder().setRandomUUID().darkMode(false).contentLanguage("en").build())
      .build();
    pactUser.getUserPreferences().setUser(pactUser);

    doThrow(new UserExistsException("pactUser@localhost")).when(userService)
      .signup(argThat(input -> input.getEmail().equals("pactUser@localhost")));
    doThrow(new UserExistsException("pactUser")).when(userService)
      .signup(argThat(input -> input.getUsername().equals("pactUser")));
    doReturn(Optional.of(User.builder()
      .setRandomUUID()
      .role(Role.builder().setRandomUUID().name("LOCKED_ROLE").canLogin(false).build())
      .build())).when(userService).findUserByUsername("lockedRoleUser");
    doReturn(Optional.of(User.builder()
      .setRandomUUID()
      .locked(true)
      .role(Role.builder().setRandomUUID().canLogin(true).build())
      .build())).when(userService).findUserByUsername("lockedUser");
    doReturn(Optional.of(pactUser)).when(userService).findUserByUsername("pactUser");

    doThrow(new UserNotFoundException("notFound@localhost")).when(userService)
      .requestActivationTokenByEmail("notFound@localhost");
    doThrow(new UserNotFoundException("notFound@localhost")).when(userService)
      .activateAccount(AccountActivationInput.builder()
        .password("notFoundPassword")
        .email("notFound@localhost")
        .token("notFoundTokenId")
        .build());
  }
}
