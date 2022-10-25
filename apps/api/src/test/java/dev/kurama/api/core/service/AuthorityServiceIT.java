package dev.kurama.api.core.service;

import static com.google.common.collect.Sets.newHashSet;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@ServiceLayerIntegrationTestConfig
@Import(AuthorityService.class)
class AuthorityServiceIT {


  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private AuthorityService authorityService;

  private Authority authority1;
  private Authority authority2;
  private Authority authority3;
  private Authority authority4;


  @BeforeEach
  void setUp() {
    authority1 = entityManager.persist(Authority.builder().setRandomUUID().name(randomAlphanumeric(6)).build());
    authority2 = entityManager.persist(Authority.builder().setRandomUUID().name(randomAlphanumeric(6)).build());
    authority3 = entityManager.persist(Authority.builder().setRandomUUID().name(randomAlphanumeric(6)).build());
    authority4 = entityManager.persist(Authority.builder().setRandomUUID().name(randomAlphanumeric(6)).build());
  }

  @Test
  void should_find_all_by_id() {
    Set<Authority> actual = authorityService.findAllById(newHashSet(authority2.getId(), authority4.getId()));

    assertThat(actual.size()).isEqualTo(2);
    assertThat(actual.toArray()).extracting("id")
      .containsExactlyInAnyOrderElementsOf(newHashSet(authority2.getId(), authority4.getId()));
  }

  @Test
  void should_get_all() {
    Page<Authority> actual = authorityService.getAllAuthorities(PageRequest.of(0, 20));

    assertThat(actual.getContent().size()).isEqualTo(4);
    assertThat(actual.getContent().toArray()).extracting("id")
      .containsExactlyInAnyOrderElementsOf(
        newHashSet(authority1.getId(), authority2.getId(), authority3.getId(), authority4.getId()));
  }

  @Test
  void should_find_one_by_id() {
    Optional<Authority> authorityById = authorityService.findAuthorityById(authority3.getId());

    assertThat(authorityById).isPresent()
      .hasValueSatisfying(authority -> assertThat(authority.getId()).isEqualTo(authority3.getId()));
  }
}
