package dev.kurama.api.core.service;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.exception.domain.not.found.DomainEntityNotFoundException;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.support.ServiceLayerIntegrationTestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({UserPreferencesService.class})
class UserPreferencesServiceIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private UserPreferencesService service;

  private UserPreferences userPreferences;

  @BeforeEach
  void setUp() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    User user1 = User.builder().setRandomUUID().userPreferences(userPreferences).role(role).build();
    userPreferences = UserPreferences.builder()
      .setRandomUUID()
      .user(user1)
      .darkMode(true)
      .contentLanguage("jp")
      .build();
    user1.setUserPreferences(userPreferences);

    entityManager.persist(user1);

    User user2 = User.builder().setRandomUUID().userPreferences(userPreferences).role(role).build();
    user2.setUserPreferences(
      UserPreferences.builder().setRandomUUID().user(user1).darkMode(true).contentLanguage("jp").build());

    entityManager.persist(user2);
  }

  @Test
  void should_find_user_preferences_by_id() throws DomainEntityNotFoundException {
    assertThat(service.findUserPreferencesById(userPreferences.getId())).isNotNull()
      .extracting("id")
      .isEqualTo(userPreferences.getId());
  }

  @Test
  void should_update_user_preferences() throws DomainEntityNotFoundException {
    UserPreferencesInput input = UserPreferencesInput.builder().darkMode(false).contentLanguage("cn").build();

    UserPreferences actual = service.updateUserPreferences(this.userPreferences.getId(), input);

    assertThat(actual.getId()).isEqualTo(userPreferences.getId());
    assertThat(actual.getUser().getId()).isEqualTo(userPreferences.getUser().getId());
    assertThat(actual.getContentLanguage()).isEqualTo(input.getContentLanguage());
    assertThat(actual.isDarkMode()).isEqualTo(input.getDarkMode());
  }

  @Test
  void should_find_user_preferences_by_user_id() {
    UserPreferences actual = service.findUserPreferencesByUserId(userPreferences.getUser().getId());

    assertThat(actual.getId()).isEqualTo(userPreferences.getId());
    assertThat(actual.getUser().getId()).isEqualTo(userPreferences.getUser().getId());
  }

  @Test
  void should_update_user_preferences_by_user_id() {
    UserPreferencesInput input = UserPreferencesInput.builder().darkMode(false).contentLanguage("cn").build();

    UserPreferences actual = service.updateUserPreferencesByUserId(this.userPreferences.getUser().getId(), input);

    assertThat(actual.getId()).isEqualTo(userPreferences.getId());
    assertThat(actual.getUser().getId()).isEqualTo(userPreferences.getUser().getId());
    assertThat(actual.getContentLanguage()).isEqualTo(input.getContentLanguage());
    assertThat(actual.isDarkMode()).isEqualTo(input.getDarkMode());
  }
}
