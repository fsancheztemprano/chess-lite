package dev.kurama.chess.backend.domain;

import static dev.kurama.chess.backend.authority.Authority.ADMIN_AUTHORITIES;
import static dev.kurama.chess.backend.authority.Authority.MOD_AUTHORITIES;
import static dev.kurama.chess.backend.authority.Authority.SUPER_ADMIN_AUTHORITIES;
import static dev.kurama.chess.backend.authority.Authority.USER_AUTHORITIES;

import java.util.List;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
  USER_ROLE(USER_AUTHORITIES),
  MOD_ROLE(MOD_AUTHORITIES),
  ADMIN_ROLE(ADMIN_AUTHORITIES),
  SUPER_ADMIN_ROLE(SUPER_ADMIN_AUTHORITIES);

  @NonNull
  private final List<String> authorities;

}
