package dev.kurama.chess.backend.auth;

import dev.kurama.chess.backend.auth.domain.Role;
import dev.kurama.chess.backend.auth.domain.User;
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


  @Override
  public void run(String... args) throws Exception {
    final var ADMIN_USERNAME = "admin";
    var admin = userService.findUserByUsername(ADMIN_USERNAME);
    if (admin == null) {
      userService.createUser(
        User.builder()
          .username(ADMIN_USERNAME)
          .email("admin@example.com")
          .password("123456")
          .role(Role.SUPER_ADMIN_ROLE.name())
          .active(true)
          .locked(false)
          .expired(false)
          .credentialsExpired(false)
          .build());
    } else {
      admin.setRole(Role.SUPER_ADMIN_ROLE.name());
      userService.updateUser(ADMIN_USERNAME, admin);
    }
  }
}
