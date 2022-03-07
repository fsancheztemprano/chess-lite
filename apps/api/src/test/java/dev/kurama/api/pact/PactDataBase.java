package dev.kurama.api.pact;

import static dev.kurama.api.core.authority.DefaultAuthority.DEFAULT_ROLE;
import static org.hibernate.validator.internal.util.CollectionHelper.newHashSet;

import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.Authority;
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
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.core.service.DataInitializationService;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.api.core.service.RoleService;
import dev.kurama.api.core.service.UserService;
import java.util.Date;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.flogger.Flogger;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Flogger
@RequiredArgsConstructor
@Component
public class PactDataBase extends PactBase {

  @Setter(onMethod = @__({@Autowired}))
  private DataInitializationService initializationService;

  @Setter(onMethod = @__({@Autowired}))
  private RoleRepository roleRepository;

  @Setter(onMethod = @__({@Autowired}))
  private GlobalSettingsService globalSettingsService;

  @Setter(onMethod = @__({@Autowired}))
  private RoleService roleService;

  @Setter(onMethod = @__({@Autowired}))
  private UserService userService;

  @Setter(onMethod = @__({@Autowired}))
  private UserRepository userRepository;

  @Setter(onMethod = @__({@Autowired}))
  private AuthorityRepository authorityRepository;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();
    initialize();
  }

  @Transactional
  public void initialize() throws Exception {
    try {
      if (!isInitialized()) {
        log.atInfo().log("Pact Data Loader Start");
        initialization();
        log.atWarning().log("Pact Data Loader Complete");
      }
      log.atFine().log("Pact Data already loaded.");
    } catch (Exception e) {
      log.atWarning().withCause(e).log("Pact Data Loader Error");
      throw e;
    }
  }

  protected boolean isInitialized() {
    return roleRepository.findByName(DEFAULT_ROLE).isPresent();
  }

  protected void initialization()
    throws RoleNotFoundException, ImmutableRoleException, RoleExistsException, UsernameExistsException,
    EmailExistsException, ActivationTokenRecentException {

    initializationService.initializeAuthorities();
    initializationService.initializeRoles();
    initializationService.setRolesAuthorizations();
    initializationService.initializeGlobalSettings();

    openUserSignup();

    // Authentication
    createUser();
    createLockedUser();
    createLockedRoleUser();
    createActivationUser();

    //Authority
    createAuthority();
  }

  private void openUserSignup() throws RoleNotFoundException, ImmutableRoleException {
    Role userRole = globalSettingsService.getGlobalSettings().getDefaultRole();

    Role pactDefaultRole = roleRepository.saveAndFlush(Role.builder()
      .id("defaultPactRoleId")
      .name("DEFAULT_PACT_ROLE")
      .canLogin(true)
      .authorities(newHashSet(userRole.getAuthorities()))
      .build());

    globalSettingsService.updateGlobalSettings(
      GlobalSettingsUpdateInput.builder().signupOpen(true).defaultRoleId(pactDefaultRole.getId()).build());
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

  // Authority Controller Data


  private void createAuthority() {
    authorityRepository.saveAndFlush(Authority.builder().id("authorityId").name("pact:test:read").build());
  }
}
