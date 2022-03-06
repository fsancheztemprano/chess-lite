package dev.kurama.support;

import static dev.kurama.api.core.authority.DefaultAuthority.DEFAULT_ROLE;

import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.service.DataInitializationService;
import dev.kurama.api.core.service.RoleService;
import javax.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Flogger
@NoArgsConstructor
@Component
public class PactDataLoader {

  protected DataInitializationService initializationService;

  protected RoleService roleService;

  @Autowired
  public void setInitializationService(DataInitializationService initializationService) {
    this.initializationService = initializationService;
  }

  @Autowired
  public void setRoleService(RoleService roleService) {
    this.roleService = roleService;
  }

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
    return roleService.findByName(DEFAULT_ROLE).isPresent();
  }

  protected void initialization()
    throws RoleNotFoundException, ImmutableRoleException, RoleExistsException, UsernameExistsException,
    EmailExistsException, ActivationTokenRecentException {
    if (roleService.findByName(DEFAULT_ROLE).isEmpty()) {
      log.atFine().log("Core Pact Data Loader Start");
      initializationService.initializeAuthorities();
      initializationService.initializeRoles();
      initializationService.setRolesAuthorizations();
      initializationService.initializeGlobalSettings();
      log.atFine().log("Core Pact Data Loader Start");
    } else {
      log.atFine().log("Core Pact Data already loaded.");
    }
  }
}
