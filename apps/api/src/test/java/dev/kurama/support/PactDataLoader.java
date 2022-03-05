package dev.kurama.support;

import static dev.kurama.api.core.authority.DefaultAuthority.DEFAULT_ROLE;

import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.service.DataInitializationService;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.api.core.service.RoleService;
import dev.kurama.api.core.service.UserService;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.stereotype.Component;

@Flogger
@RequiredArgsConstructor
@Component
public class PactDataLoader {

  @NonNull
  private final GlobalSettingsService globalSettingsService;

  @NonNull
  private final UserService userService;

  @NonNull
  private final RoleService roleService;

  @NonNull
  private final DataInitializationService initializationService;


  @Transactional
  public void initialize() throws Exception {
    try {
      if (!isInitialized()) {
        log.atInfo().log("Pact Data Loader Start");
        initializationService.initializeAuthorities();
        initializationService.initializeRoles();
        initializationService.setRolesAuthorizations();
        initializationService.initializeGlobalSettings();

        openUserSignup();

        createUser();
        createLockedUser();
        createLockedRoleUser();
        log.atInfo().log("Pact Data Loader Complete");
      }
    } catch (Exception e) {
      log.atWarning().withCause(e).log("Pact Data Loader Error");
      throw e;
    }
  }


  private boolean isInitialized() {
    return roleService.findByName(DEFAULT_ROLE).isPresent() && globalSettingsService.getGlobalSettings().isSignupOpen();
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
