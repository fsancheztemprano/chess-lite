package dev.kurama.api.pact;

import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.pact.AuthenticationControllerBase.AuthenticationControllerBaseDataLoader;
import dev.kurama.support.PactDataLoader;
import java.util.Date;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Import;

@Import(AuthenticationControllerBaseDataLoader.class)
@EnableAutoConfiguration()
public abstract class AuthenticationControllerBase extends PactBase {

  @Autowired
  private AuthenticationControllerBaseDataLoader dataLoader;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();
    dataLoader.initialize();
  }

  @RequiredArgsConstructor
  public static class AuthenticationControllerBaseDataLoader extends PactDataLoader {

    @NonNull
    private final GlobalSettingsService globalSettingsService;

    @NonNull
    private final UserService userService;

    @NonNull
    private final UserRepository userRepository;

    @Override
    protected String getName() {
      return "Authentication Controller";
    }

    @Override
    protected void initialization()
      throws RoleNotFoundException, ImmutableRoleException, RoleExistsException, UsernameExistsException,
      EmailExistsException, ActivationTokenRecentException {
      super.initialization();

      openUserSignup();

      createUser();
      createLockedUser();
      createLockedRoleUser();
      createActivationUser();
    }

    @Override
    protected boolean isInitialized() {
      return super.isInitialized() && globalSettingsService.getGlobalSettings().isSignupOpen();
    }

    private void openUserSignup() throws RoleNotFoundException, ImmutableRoleException, RoleExistsException {
      Role userRole = globalSettingsService.getGlobalSettings().getDefaultRole();

      Role defaultRole = roleService.create("PACT_ROLE");

      globalSettingsService.updateGlobalSettings(
        GlobalSettingsUpdateInput.builder().signupOpen(true).defaultRoleId(defaultRole.getId()).build());

      roleService.update(globalSettingsService.getGlobalSettings().getDefaultRole().getId(), RoleUpdateInput.builder()
        .canLogin(true)
        .authorityIds(userRole.getAuthorities().stream().map(AbstractEntity::getId).collect(Collectors.toSet()))
        .build());
    }

    private void createUser() throws UsernameExistsException, EmailExistsException {
      userService.createUser(UserInput.builder()
        .id("johnDoeId")
        .username("johnDoe")
        .email("johnDoe@example.com")
        .password("johnDoe0")
        .build());
    }

    private void createLockedUser() throws UsernameExistsException, EmailExistsException {
      userService.createUser(UserInput.builder()
        .id("lockedUserId")
        .username("lockedUser")
        .email("lockedUser@example.com")
        .password("lockedUser")
        .locked(true)
        .build());
    }

    private void createActivationUser()
      throws UsernameExistsException, EmailExistsException, ActivationTokenRecentException {
      User lockedUser = userService.createUser(UserInput.builder()
        .id("activationUserId")
        .username("activationUser")
        .email("activationUser@example.com")
        .password("activationUser")
        .locked(true)
        .build());
      lockedUser.setActivationToken(
        ActivationToken.builder().id("activationUserTokenId").user(lockedUser).created(new Date()).attempts(0).build());
      userRepository.saveAndFlush(lockedUser);
    }

    private void createLockedRoleUser()
      throws UsernameExistsException, EmailExistsException, ImmutableRoleException, RoleNotFoundException,
      RoleExistsException {
      Role locked = roleService.create("LOCKED_ROLE");
      locked = roleService.update(locked.getId(), RoleUpdateInput.builder().canLogin(false).build());
      userService.createUser(UserInput.builder()
        .id("lockedRoleUserId")
        .username("lockedRoleUser")
        .email("lockedRoleUser@example.com")
        .password("lockedRoleUser")
        .locked(false)
        .roleId(locked.getId())
        .build());
    }
  }
}
