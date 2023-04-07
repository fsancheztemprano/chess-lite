package dev.kurama.api.core.service;

import static java.lang.String.format;

import com.google.common.collect.Sets;
import com.google.common.flogger.FluentLogger;
import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayerRepository;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Flogger
@RequiredArgsConstructor
@Service
public class DataInitializationService {

  @NonNull
  private final UserRepository userRepository;

  @NonNull
  private final RoleRepository roleRepository;

  @NonNull
  private final AuthorityRepository authorityRepository;

  @NonNull
  private final GlobalSettingsRepository globalSettingsRepository;

  @NonNull
  private final TicTacToePlayerRepository ticTacToePlayerRepository;

  @NonNull
  private final BCryptPasswordEncoder passwordEncoder;

  @Transactional
  public void initialize() {
    try {
      log(log.atInfo(), "Data Initialization Start");
      initializeAuthorities();
      initializeRoles();
      setRolesAuthorizations();
      initializeGlobalSettings();
      initializeAdminUser();
      log(log.atInfo(), "Data Initialization Complete");
    } catch (Exception e) {
      log(log.atWarning().withCause(e), "Data Initialization Failed");
    }
  }


  @Transactional
  public void initializeAuthorities() {
    List<Authority> existentAuthorities = authorityRepository.findAll();
    List<Authority> newAuthorities = DefaultAuthority.AUTHORITIES.stream()
      .filter(authorityName -> existentAuthorities.stream()
        .noneMatch(existingAuthority -> existingAuthority.getName().equals(authorityName)))
      .map(authorityName -> Authority.builder().setRandomUUID().name(authorityName).build())
      .collect(Collectors.toList());
    if (!newAuthorities.isEmpty()) {
      int inserts = authorityRepository.saveAllAndFlush(newAuthorities).size();
      if (inserts > 0) {
        log(log.atInfo(), format("Initialized Authorities -> %d", inserts));
      }
    }
  }

  @Transactional
  public void initializeRoles() {
    List<Role> existentRoles = roleRepository.findAll();
    List<Role> newRoles = DefaultAuthority.ROLES.stream()
      .filter(role -> existentRoles.stream().noneMatch(existingRole -> existingRole.getName().equals(role)))
      .map(role -> Role.builder()
        .setRandomUUID()
        .name(role)
        .coreRole(true)
        .canLogin(role.equals(DefaultAuthority.SUPER_ADMIN_ROLE))
        .build())
      .collect(Collectors.toList());
    if (!newRoles.isEmpty()) {
      int inserts = roleRepository.saveAllAndFlush(newRoles).size();
      if (inserts > 0) {
        log(log.atInfo(), format("Initialized Roles -> %d", inserts));
      }
    }
  }

  @Transactional
  public void setRolesAuthorizations() {
    List<Authority> allAuthorities = authorityRepository.findAll();
    List<Role> allRoles = roleRepository.findAll();
    List<Role> updatableRoles = allRoles.stream()
      .filter(role -> DefaultAuthority.ROLE_AUTHORITIES.containsKey(role.getName()))
      .filter(role -> {
        Set<Authority> currentRoleAuthorities = role.getAuthorities();
        List<String> defaultRoleAuthorities = DefaultAuthority.ROLE_AUTHORITIES.get(role.getName());
        boolean authoritiesMismatch = defaultRoleAuthorities.stream()
          .anyMatch(
            authorityName -> currentRoleAuthorities.stream().map(Authority::getName).noneMatch(authorityName::equals));
        if (authoritiesMismatch) {
          role.setAuthorities(Sets.newHashSet(allAuthorities.stream()
            .filter(authority -> defaultRoleAuthorities.contains(authority.getName()))
            .collect(Collectors.toSet())));
          return true;
        } else {
          return false;
        }
      })
      .toList();
    if (!updatableRoles.isEmpty()) {
      int updates = roleRepository.saveAllAndFlush(updatableRoles).size();
      if (updates > 0) {
        log(log.atInfo(), format("Updated Role Authorities -> %d", updates));
      }
    }
  }

  @Transactional
  public void initializeGlobalSettings() throws RoleNotFoundException {
    long existentGlobalSettings = globalSettingsRepository.count();
    if (existentGlobalSettings != 1) {
      if (existentGlobalSettings > 1) {
        globalSettingsRepository.deleteAll();
      }
      var defaultRole = roleRepository.findByName(DefaultAuthority.DEFAULT_ROLE)
        .orElseThrow(() -> new RoleNotFoundException(DefaultAuthority.DEFAULT_ROLE));
      globalSettingsRepository.saveAndFlush(
        GlobalSettings.builder().id(GlobalSettings.UNIQUE_ID).signupOpen(false).defaultRole(defaultRole).build());
      log(log.atInfo(), "Global Settings Initialized");
    }
  }

  @Transactional
  public void initializeAdminUser() throws RoleNotFoundException {
    if (userRepository.count() < 1) {
      var superAdminRole = roleRepository.findByName(DefaultAuthority.SUPER_ADMIN_ROLE)
        .orElseThrow(() -> new RoleNotFoundException(DefaultAuthority.SUPER_ADMIN_ROLE));

      User admin = userRepository.saveAndFlush(User.builder()
        .setRandomUUID()
        .username("admin")
        .email("admin@localhost")
        .password(passwordEncoder.encode("123456"))
        .role(superAdminRole)
        .authorities(superAdminRole.getAuthorities())
        .joinDate(new Date())
        .active(true)
        .locked(false)
        .expired(false)
        .credentialsExpired(false)
        .userPreferences(UserPreferences.builder().setRandomUUID().build())
        .build());
      ticTacToePlayerRepository.saveAndFlush(
        TicTacToePlayer.builder().setIdOrRandomUUID(admin.getId()).user(admin).username(admin.getUsername()).build());
      log(log.atInfo(), "Admin User Initialized");
    }
  }

  public void log(FluentLogger.Api log, String message) {
    log.log(message);
  }
}
