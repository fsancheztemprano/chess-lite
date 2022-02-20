package dev.kurama.api.core.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.core.domain.Role;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@ActiveProfiles(value = "data-jpa")
class RoleRepositoryIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private RoleRepository roleRepository;

  @Test
  void should_find_role_by_name() {
    Role role1 = Role.builder().setRandomUUID().name("r1").build();
    entityManager.persist(role1);
    Role role2 = Role.builder().setRandomUUID().name("r2").build();
    entityManager.persist(role2);
    Role role3 = Role.builder().setRandomUUID().name("r3").build();
    entityManager.persist(role3);
    entityManager.flush();

    Optional<Role> actual = roleRepository.findByName(role2.getName());

    assertThat(actual).isPresent()
      .get()
      .hasFieldOrPropertyWithValue("id", role2.getId())
      .hasFieldOrPropertyWithValue("name", role2.getName());
  }
}
