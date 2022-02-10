package dev.kurama.api.core;


import com.google.common.collect.Sets;
import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.*;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Flogger
@RequiredArgsConstructor
public class InitializationRunner implements CommandLineRunner {

  @Value("${application.run_data_init}")
  private boolean dataInit;

  @NonNull
  private final UserRepository userRepository;

  @NonNull
  private final RoleRepository roleRepository;

  @NonNull
  private final AuthorityRepository authorityRepository;

  @NonNull
  private final GlobalSettingsRepository globalSettingsRepository;

  @NonNull
  private final BCryptPasswordEncoder passwordEncoder;

  @Override
  @Transactional
  public void run(String... args) {
    if (dataInit) {
      try {
        log.atInfo()
          .log("Data Initialization Start");
        initializeAuthorities();
        initializeRoles();
        setRolesAuthorizations();
        initializeGlobalSettings();
        initializeAdminUser();
        log.atInfo()
          .log("Data Initialization Finish");
      } catch (Exception e) {
        log.atWarning()
          .log("Data Initialization Failed");
      }
    }
  }

  @Transactional
  void initializeAuthorities() {
    List<Authority> existentAuthorities = authorityRepository.findAll();
    List<Authority> newAuthorities = DefaultAuthority.AUTHORITIES.stream()
      .filter(authorityName -> existentAuthorities.stream()
        .noneMatch(existingAuthority -> existingAuthority.getName()
          .equals(authorityName)))
      .map(authorityName -> Authority.builder()
        .setRandomUUID()
        .name(authorityName)
        .build())
      .collect(Collectors.toList());
    if (!newAuthorities.isEmpty()) {
      int inserts = authorityRepository.saveAllAndFlush(newAuthorities)
        .size();
      if (inserts > 0) {
        log.atInfo()
          .log("Initialized Authorities -> %d", inserts);
      }
    }
  }

  @Transactional
  void initializeRoles() {
    List<Role> existentRoles = roleRepository.findAll();
    List<Role> newRoles = DefaultAuthority.ROLES.stream()
      .filter(role -> existentRoles.stream()
        .noneMatch(existingRole -> existingRole.getName()
          .equals(role)))
      .map(
        role -> Role.builder()
          .setRandomUUID()
          .name(role)
          .coreRole(true)
          .canLogin(!role.equals(DefaultAuthority.DEFAULT_ROLE))
          .build())
      .collect(Collectors.toList());
    if (!newRoles.isEmpty()) {
      int inserts = roleRepository.saveAllAndFlush(newRoles)
        .size();
      if (inserts > 0) {
        log.atInfo()
          .log("Initialized Roles -> %d", inserts);
      }
    }
  }

  @Transactional
  void setRolesAuthorizations() {
    List<Authority> allAuthorities = authorityRepository.findAll();
    List<Role> allRoles = roleRepository.findAll();
    List<Role> updatableRoles = allRoles.stream()
      .filter(role -> {
        Set<Authority> currentRoleAuthorities = role.getAuthorities();
        List<String> defaultRoleAuthorities = DefaultAuthority.ROLE_AUTHORITIES.get(role.getName());
        boolean authoritiesMismatch = defaultRoleAuthorities.stream()
          .anyMatch(authorityName -> currentRoleAuthorities.stream()
            .map(Authority::getName)
            .noneMatch(authorityName::equals));
        if (authoritiesMismatch) {
          role.setAuthorities(Sets.newHashSet(
            allAuthorities.stream()
              .filter(authority -> defaultRoleAuthorities.contains(authority.getName()))
              .collect(Collectors.toSet())));
          return true;
        } else {
          return false;
        }
      })
      .collect(Collectors.toList());
    if (!updatableRoles.isEmpty()) {
      int updates = roleRepository.saveAllAndFlush(updatableRoles)
        .size();
      if (updates > 0) {
        log.atInfo()
          .log("Updated Role Authorities -> %d", updates);
      }
    }
  }

  @Transactional
  void initializeGlobalSettings() throws RoleNotFoundException {
    long existentGlobalSettings = globalSettingsRepository.count();
    if (existentGlobalSettings != 1) {
      if (existentGlobalSettings > 1) {
        globalSettingsRepository.deleteAll();
      }
      var defaultRole = roleRepository.findByName(DefaultAuthority.DEFAULT_ROLE)
        .orElseThrow(() -> new RoleNotFoundException(DefaultAuthority.DEFAULT_ROLE));
      globalSettingsRepository.saveAndFlush(
        GlobalSettings.builder()
          .id(GlobalSettings.UNIQUE_ID)
          .signupOpen(false)
          .defaultRole(defaultRole)
          .build());
      log.atInfo()
        .log("Global Settings Initialized");
    }
  }

  @Transactional
  void initializeAdminUser() throws RoleNotFoundException {
    if (userRepository.count() < 1) {
      var superAdminRole = roleRepository.findByName(DefaultAuthority.SUPER_ADMIN_ROLE)
        .orElseThrow(() -> new RoleNotFoundException(DefaultAuthority.SUPER_ADMIN_ROLE));

      userRepository.saveAndFlush(User.builder()
        .setRandomUUID()
        .username("admin")
        .email("admin@example.com")
        .password(passwordEncoder.encode("123456"))
        .role(superAdminRole)
        .authorities(superAdminRole.getAuthorities())
        .joinDate(new Date())
        .active(true)
        .locked(false)
        .expired(false)
        .credentialsExpired(false)
        .userPreferences(UserPreferences.builder()
          .setRandomUUID()
          .build())
        .build());
      log.atInfo()
        .log("Admin User Initialized");
    }
  }
}
