package dev.kurama.api.core;


import com.google.common.collect.Sets;
import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.core.service.UserService;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Flogger
@RequiredArgsConstructor
public class InitializationRunner implements CommandLineRunner {

  @Value("${application.run_data_init}")
  private boolean dataInit;

  @NonNull
  private final UserRepository userRepository;

  @NonNull
  private final UserService userService;

  @NonNull
  private final RoleRepository roleRepository;

  @NonNull
  private final AuthorityRepository authorityRepository;

  @NonNull
  private final GlobalSettingsRepository globalSettingsRepository;

  @Override
  @Transactional
  public void run(String... args) {
    if (dataInit) {
      try {
        log.atWarning().log("Data Initialization Start");
        initializeAuthorities();
        initializeRoles();
        setRolesAuthorizations();
        initializeGlobalSettings();
        initializeAdminUser();
        log.atWarning().log("Data Initialization Finish");
      } catch (Exception e) {
        log.atWarning().withCause(e).log("Data Initialization Failed");
      }
    }
  }

  @Transactional
  void initializeAuthorities() {
    List<Authority> authorities = authorityRepository.findAll();
    if (authorities.size() != DefaultAuthority.AUTHORITIES.size()) {
      int inserts = authorityRepository.saveAllAndFlush(DefaultAuthority.AUTHORITIES.stream().filter(
            authority -> authorities.stream().noneMatch(existingAuthority -> existingAuthority.getName().equals(authority)))
          .map(authority -> Authority.builder().setRandomUUID().name(authority).build()).collect(Collectors.toList()))
        .size();
      log.atInfo().log("Initialized Authorities -> %d", inserts);
    }
  }

  @Transactional
  void initializeRoles() {
    List<Role> roles = roleRepository.findAll();
    if (roles.size() != DefaultAuthority.ROLES.size()) {
      int inserts = roleRepository.saveAllAndFlush(DefaultAuthority.ROLES.stream()
        .filter(role -> roles.stream().noneMatch(existingRole -> existingRole.getName().equals(role))).map(
          role -> Role.builder().setRandomUUID().name(role).coreRole(true)
            .canLogin(!role.equals(DefaultAuthority.DEFAULT_ROLE)).build()).collect(Collectors.toList())).size();
      log.atInfo().log("Initialized Roles -> %d", inserts);
    }
  }

  @Transactional
  void setRolesAuthorizations() {
    List<Authority> allAuthorities = authorityRepository.findAll();
    List<Role> allRoles = roleRepository.findAll();
    int updatedRoleAuthorities = roleRepository.saveAllAndFlush(allRoles.stream().filter(role -> {
      Set<Authority> roleAuthorities = role.getAuthorities();
      List<String> defaultRoleAuthorities = DefaultAuthority.ROLE_AUTHORITIES.get(role.getName());
      if (roleAuthorities.size() != defaultRoleAuthorities.size() || roleAuthorities.stream()
        .anyMatch(authority -> !defaultRoleAuthorities.contains(authority.getName()))) {
        role.setAuthorities(Sets.newHashSet(
          allAuthorities.stream().filter(authority -> defaultRoleAuthorities.contains(authority.getName()))
            .collect(Collectors.toSet())));
        return true;
      } else {
        return false;
      }
    }).collect(Collectors.toSet())).size();
    if (updatedRoleAuthorities > 0) {
      log.atInfo().log("Updated Role Authorities -> %d", updatedRoleAuthorities);
    }
  }

  @Transactional
  void initializeGlobalSettings() {
    if (globalSettingsRepository.count() != 1) {
      var defaultRole = roleRepository.findByName(DefaultAuthority.DEFAULT_ROLE).orElseThrow();
      globalSettingsRepository.deleteAll();
      globalSettingsRepository.saveAndFlush(
        GlobalSettings.builder().id(GlobalSettings.UNIQUE_ID).signupOpen(false).defaultRole(defaultRole).build());
      log.atInfo().log("Global Settings Initialized");
    }
  }

  @Transactional
  void initializeAdminUser() throws UsernameExistsException, EmailExistsException {
    if (userRepository.count() < 1) {
      var superAdminRole = roleRepository.findByName(DefaultAuthority.SUPER_ADMIN_ROLE).orElseThrow();
      userService.createUser(UserInput.builder().username("admin").email("admin@example.com").password("123456")
        .roleId(superAdminRole.getId()).active(true).locked(false).expired(false).credentialsExpired(false).build());
      log.atInfo().log("Admin User Initialized");
    }
  }
}
