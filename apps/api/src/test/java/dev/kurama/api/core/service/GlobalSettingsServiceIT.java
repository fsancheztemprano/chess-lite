package dev.kurama.api.core.service;

import static dev.kurama.api.core.domain.GlobalSettings.UNIQUE_ID;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.support.MockEventLayer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles(value = "integration-test")
@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@Import({GlobalSettingsService.class, RoleService.class, AuthorityService.class})
@MockEventLayer
class GlobalSettingsServiceIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private GlobalSettingsService globalSettingsService;


  @Test
  void should_create_global_settings() throws Exception {
    entityManager.persist(Role.builder().setRandomUUID().name(DefaultAuthority.DEFAULT_ROLE).build());

    GlobalSettings actual = globalSettingsService.getGlobalSettings();

    assertNotNull(actual);
  }

  @Test
  void get_global_settings() {
    GlobalSettings expected = entityManager.persist(GlobalSettings.builder().id(UNIQUE_ID).signupOpen(true).build());

    GlobalSettings actual = globalSettingsService.getGlobalSettings();

    assertThat(actual).isEqualTo(expected);
  }

  @Test
  void update_global_settings() throws RoleNotFoundException {
    Role defaultRole = entityManager.persist(
      Role.builder().setRandomUUID().name(DefaultAuthority.DEFAULT_ROLE).build());
    Role otherRole = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    GlobalSettings expected = entityManager.persist(
      GlobalSettings.builder().id(UNIQUE_ID).defaultRole(defaultRole).signupOpen(true).build());
    GlobalSettingsUpdateInput input = GlobalSettingsUpdateInput.builder()
      .signupOpen(false)
      .defaultRoleId(otherRole.getId())
      .build();

    GlobalSettings actual = globalSettingsService.updateGlobalSettings(input);

    assertThat(actual.getId()).isEqualTo(expected.getId());
    assertThat(actual.isSignupOpen()).isEqualTo(input.getSignupOpen());
    assertThat(actual.getDefaultRole().getId()).isEqualTo(input.getDefaultRoleId());
  }
}
