package dev.kurama.api.core.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@ActiveProfiles(value = "integration-test")
class UserPreferencesRepositoryIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private UserPreferencesRepository userPreferencesRepository;

  @Test
  void should_find_user_preferences_by_user_id() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name("r1").build());
    UserPreferences userPreferences1 = UserPreferences.builder().setRandomUUID().build();
    User user1 = User.builder().setRandomUUID().username("user1").userPreferences(userPreferences1).role(role).build();
    userPreferences1.setUser(user1);
    entityManager.persist(user1);
    entityManager.flush();

    Optional<UserPreferences> actual = userPreferencesRepository.findUserPreferencesByUserId(user1.getId());

    assertThat(actual).isPresent()
      .get()
      .hasFieldOrPropertyWithValue("id", userPreferences1.getId())
      .hasFieldOrProperty("user")
      .extracting("user")
      .hasFieldOrPropertyWithValue("id", user1.getId());
  }
}
