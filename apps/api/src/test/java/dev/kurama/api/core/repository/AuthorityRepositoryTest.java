package dev.kurama.api.core.repository;

import static com.google.common.collect.Sets.newHashSet;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.core.domain.Authority;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@ActiveProfiles(value = "integration-test")
class AuthorityRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private AuthorityRepository authorityRepository;

  @Test
  void should_find_all_filtered_by_id() {
    Authority authority1 = Authority.builder().setRandomUUID().name("auth1").build();
    entityManager.persist(authority1);
    Authority authority2 = Authority.builder().setRandomUUID().name("auth2").build();
    entityManager.persist(authority2);
    Authority authority3 = Authority.builder().setRandomUUID().name("auth3").build();
    entityManager.persist(authority3);
    Authority authority4 = Authority.builder().setRandomUUID().name("auth4").build();
    entityManager.persist(authority4);
    entityManager.flush();

    Set<Authority> actual = authorityRepository.findAllByIdIn(newHashSet(authority2.getId(), authority4.getId()));

    assertThat(actual.size()).isEqualTo(2);
    assertThat(actual.stream().allMatch(
      authority -> authority.getId().equals(authority2.getId()) || authority.getId()
        .equals(authority4.getId()))).isTrue();
  }
}
