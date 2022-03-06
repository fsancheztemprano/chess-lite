package dev.kurama.api.pact;

import static dev.kurama.api.core.authority.DefaultAuthority.DEFAULT_ROLE;
import static org.hibernate.validator.internal.util.CollectionHelper.newHashSet;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.service.DataInitializationService;
import dev.kurama.api.core.service.GlobalSettingsService;
import javax.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Flogger
@NoArgsConstructor
@Component
public class PactDataLoader {

  @Setter(onMethod = @__({@Autowired}))
  protected DataInitializationService initializationService;

  @Setter(onMethod = @__({@Autowired}))
  protected RoleRepository roleRepository;

  @Setter(onMethod = @__({@Autowired}))
  private GlobalSettingsService globalSettingsService;

  protected String getName() {
    return "Core";
  }

  @Transactional
  public void initialize() throws Exception {
    try {
      if (!isInitialized()) {
        log.atInfo().log(getName() + " Pact Data Loader Start");
        initialization();
        log.atWarning().log(getName() + " Pact Data Loader Complete");
      }
      log.atFine().log(getName() + " Pact Data already loaded.");
    } catch (Exception e) {
      log.atWarning().withCause(e).log(getName() + " Pact Data Loader Error");
      throw e;
    }
  }

  protected boolean isInitialized() {
    return roleRepository.findByName(DEFAULT_ROLE).isPresent();
  }

  protected void initialization()
    throws RoleNotFoundException, ImmutableRoleException, RoleExistsException, UsernameExistsException,
    EmailExistsException, ActivationTokenRecentException {
    if (roleRepository.findByName(DEFAULT_ROLE).isEmpty()) {
      log.atFine().log("Core Pact Data Loader Start");
      initializationService.initializeAuthorities();
      initializationService.initializeRoles();
      initializationService.setRolesAuthorizations();
      initializationService.initializeGlobalSettings();

      openUserSignup();
      log.atFine().log("Core Pact Data Loader Start");
    } else {
      log.atFine().log("Core Pact Data already loaded.");
    }
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
}
