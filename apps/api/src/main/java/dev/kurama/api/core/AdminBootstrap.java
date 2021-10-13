package dev.kurama.api.core;


import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.core.service.UserService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Flogger
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {

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
  public void run(String... args) {
    try {
      authorityRepository.saveAllAndFlush(
        DefaultAuthority.AUTHORITIES.stream()
          .filter(authority -> authorityRepository.findByName(authority).isEmpty())
          .map(authority ->
            Authority.builder()
              .setRandomUUID()
              .name(authority)
              .build())
          .collect(Collectors.toList()));

      List<Authority> authorities = authorityRepository.findAll();
      roleRepository.saveAllAndFlush(DefaultAuthority.ROLES.stream().map(roleName -> {
        Role role = roleRepository.findByName(roleName).orElse(
          Role.builder()
            .setRandomUUID()
            .name(roleName)
            .coreRole(true)
            .canLogin(!roleName.equals(DefaultAuthority.DEFAULT_ROLE))
            .build());
        role.getAuthorities().addAll(DefaultAuthority.ROLE_AUTHORITIES.get(role.getName()).stream().map(
          roleAuthority -> authorities.stream().filter(authority -> roleAuthority.contains(authority.getName()))
            .findFirst().orElseThrow()).collect(Collectors.toSet()));
        return role;
      }).collect(Collectors.toList()));

      if (globalSettingsRepository.count() != 1) {
        var defaultRole = roleRepository.findByName(DefaultAuthority.DEFAULT_ROLE).orElseThrow();
        globalSettingsRepository.deleteAll();
        globalSettingsRepository.save(
          GlobalSettings.builder()
            .setRandomUUID()
            .signupOpen(false)
            .defaultRole(defaultRole)
            .build()
        );
      }

      if (userRepository.count() < 1) {
        var superAdminRole = roleRepository.findByName(DefaultAuthority.SUPER_ADMIN_ROLE).orElseThrow();
        userService.createUser(
          UserInput.builder()
            .username("admin")
            .email("admin@example.com")
            .password("123456")
            .roleId(superAdminRole.getId())
            .active(true)
            .locked(false)
            .expired(false)
            .credentialsExpired(false)
            .build()
        );
      }
    } catch (Exception e) {
      e.printStackTrace();
      log.atWarning().log("Bootstrap Init Failed");
    }
  }
}
