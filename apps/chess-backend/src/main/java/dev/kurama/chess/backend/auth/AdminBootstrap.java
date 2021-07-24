package dev.kurama.chess.backend.auth;

import dev.kurama.chess.backend.auth.api.domain.input.UserInput;
import dev.kurama.chess.backend.auth.domain.Role;
import dev.kurama.chess.backend.auth.repository.UserRepository;
import dev.kurama.chess.backend.auth.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {

  @NonNull
  private final UserService userService;

  @NonNull
  private final UserRepository userRepository;

  @Override
  public void run(String... args) throws Exception {
    final var ADMIN_USERNAME = "admin";
    try {
      var admin = userService.findUserByUsername(ADMIN_USERNAME).orElseThrow();
      admin.setRole(Role.SUPER_ADMIN_ROLE.name());
      userRepository.save(admin);
    } catch (Exception ignored) {
      userService.createUser(
        UserInput.builder()
          .username(ADMIN_USERNAME)
          .email("admin@example.com")
          .password("123456")
          .role(Role.SUPER_ADMIN_ROLE.name())
          .active(true)
          .locked(false)
          .expired(false)
          .credentialsExpired(false)
          .build());
    }
  }
}
