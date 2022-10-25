package dev.kurama.api.core.service;

import static com.google.common.collect.Sets.newHashSet;
import static dev.kurama.api.core.domain.GlobalSettings.UNIQUE_ID;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import dev.kurama.support.TestEmailConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({RoleFacility.class, UserService.class, RoleService.class, GlobalSettingsService.class, AuthorityService.class,
  ActivationTokenService.class, TestEmailConfiguration.class, EmailService.class})
class RoleFacilityIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private RoleFacility facility;

  @Test
  void deleteRole() throws ImmutableRoleException, RoleNotFoundException {
    Role defaultRole = entityManager.persist(
      Role.builder().setRandomUUID().name(DefaultAuthority.DEFAULT_ROLE).build());
    Role role1 = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    Role role2 = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    GlobalSettings expected = entityManager.persist(
      GlobalSettings.builder().id(UNIQUE_ID).defaultRole(defaultRole).signupOpen(true).build());
    User user1 = entityManager.persist(
      User.builder().setRandomUUID().username(randomAlphanumeric(8)).role(role1).build());
    User user2 = entityManager.persist(
      User.builder().setRandomUUID().username(randomAlphanumeric(8)).role(role2).build());
    role1.setUsers(newHashSet(user1));
    entityManager.persist(role1);

    facility.deleteRole(role1.getId());

    assertNull(entityManager.find(Role.class, role1.getId()));
    assertThat(entityManager.find(User.class, user1.getId())).isNotNull()
      .extracting("role.id")
      .isEqualTo(defaultRole.getId());
    assertThat(entityManager.find(User.class, user2.getId())).isNotNull()
      .extracting("role.id")
      .isEqualTo(user2.getRole().getId());
  }
}
