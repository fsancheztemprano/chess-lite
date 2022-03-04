package dev.kurama.api.core.service;

import static com.google.common.collect.Sets.newHashSet;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@ServiceLayerIntegrationTestConfig
@Import({RoleService.class, AuthorityService.class})
class RoleServiceIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private RoleService service;

  private Role role1;

  private Role role2;

  @BeforeEach
  void setUp() {
    role1 = entityManager.persist(
      Role.builder().setRandomUUID().name(randomAlphanumeric(8)).canLogin(true).coreRole(false).build());
    role2 = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
  }

  @Test
  void should_find_by_name() {
    assertThat(service.findByName(role1.getName())).isPresent().hasValue(role1);
  }

  @Test
  void should_get_all_roles() {
    Page<Role> allRoles = service.getAllRoles(PageRequest.ofSize(20), null);

    assertThat(allRoles.getContent()).hasSize(2).containsExactlyInAnyOrder(role1, role2);
  }

  @Test
  void should_find_by_id() {
    assertThat(service.findRoleById(role2.getId())).isPresent().hasValue(role2);
  }

  @Test
  void should_create_role() throws RoleExistsException {
    String newRoleName = randomAlphanumeric(8);

    Role actual = service.create(newRoleName);

    assertThat(entityManager.find(Role.class, actual.getId())).isNotNull();
    assertThat(service.getAllRoles(PageRequest.ofSize(20), null)).hasSize(3);
  }

  @Test
  void should_update_role() throws ImmutableRoleException, RoleNotFoundException {
    Authority authority = entityManager.persist(
      Authority.builder().setRandomUUID().name(randomAlphanumeric(4)).build());
    RoleUpdateInput input = RoleUpdateInput.builder()
      .canLogin(false)
      .name(randomAlphanumeric(8))
      .authorityIds(newHashSet(authority.getId()))
      .build();

    Role actual = service.update(role1.getId(), input);

    assertThat(actual.getAuthorities()).hasSize(input.getAuthorityIds().size());
    assertThat(actual.isCanLogin()).isEqualTo(input.getCanLogin());
    assertThat(actual.getName()).isEqualTo(input.getName().toUpperCase().replace(" ", "_"));
  }
}
