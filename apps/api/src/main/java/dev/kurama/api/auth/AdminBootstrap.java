package dev.kurama.api.auth;


import com.google.common.collect.Sets;
import dev.kurama.api.auth.authority.DefaultAuthority;
import dev.kurama.api.auth.domain.Authority;
import dev.kurama.api.auth.domain.Role;
import dev.kurama.api.auth.domain.User;
import dev.kurama.api.auth.repository.AuthorityRepository;
import dev.kurama.api.auth.repository.RoleRepository;
import dev.kurama.api.auth.repository.UserRepository;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {

  @NonNull
  private final UserRepository userRepository;

  @NonNull
  private final RoleRepository roleRepository;

  @NonNull
  private final AuthorityRepository authorityRepository;

  @NonNull
  private final BCryptPasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) {
    if (authorityRepository.count() < 1) {
      authorityRepository.saveAllAndFlush(
        DefaultAuthority.AUTHORITIES.stream()
          .map(authority -> Authority.builder().setRandomUUID().name(authority).build())
          .collect(Collectors.toList()));
    }

    if (roleRepository.count() < 1) {
      List<Authority> authorities = authorityRepository.findAll();

      roleRepository.saveAllAndFlush(
        DefaultAuthority.ROLES.stream()
          .map(role -> Role.builder()
            .setRandomUUID()
            .name(role)
            .authorities(DefaultAuthority.ROLE_AUTHORITIES.get(role).stream().map(
              roleAuthority -> authorities.stream().filter(authority -> roleAuthority.contains(authority.getName()))
                .findFirst().orElseThrow()).collect(Collectors.toSet()))
            .build())
          .collect(Collectors.toList()));
    }

    if (userRepository.count() < 1) {
      var superAdminRole = roleRepository.findByName(DefaultAuthority.SUPER_ADMIN_ROLE).orElseThrow();
      userRepository.save(
        User.builder()
          .setRandomUUID()
          .username("admin")
          .email("admin@example.com")
          .password(passwordEncoder.encode("123456"))
          .role(superAdminRole)
          .authorities(Sets.newHashSet(superAdminRole.getAuthorities()))
          .joinDate(new Date())
          .active(true)
          .locked(false)
          .expired(false)
          .credentialsExpired(false)
          .build()
      );
    }
  }
}
