package dev.kurama.api.pact;

import static com.google.common.collect.Sets.newHashSet;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import java.util.Date;
import java.util.HashSet;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PactTemplate {

  public static User pactUser() {
    HashSet<Authority> authorities = newHashSet(Authority.builder().setRandomUUID().name("profile:read").build(),
      Authority.builder().setRandomUUID().name("profile:update").build(),
      Authority.builder().setRandomUUID().name("profile:delete").build());
    Role pactRole = Role.builder()
      .id("pactRoleId")
      .name("PACT_ROLE")
      .coreRole(false)
      .canLogin(true)
      .authorities(authorities)
      .build();
    User pactUser = User.builder()
      .id("pactUserId")
      .username("pactUser")
      .email("pactUser@localhost")
      .role(pactRole)
      .authorities(authorities)
      .joinDate(new Date())
      .active(true)
      .locked(false)
      .expired(false)
      .credentialsExpired(false)
      .userPreferences(
        UserPreferences.builder().id("pactUserPreferencesId").darkMode(false).contentLanguage("en").build())
      .build();
    pactUser.getUserPreferences().setUser(pactUser);
    return pactUser;
  }
}
