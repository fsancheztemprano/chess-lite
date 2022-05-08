package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.ProfileAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.ProfileAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_READ;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PREFERENCES_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PROFILE_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.CURRENT_USER_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_REL;
import static dev.kurama.api.core.message.UserPreferencesChangedMessageSender.USERS_PREFERENCES_CHANGED_CHANNEL;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_PREFERENCES;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.http.HttpMethod;

class UserPreferencesModelProcessorTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private UserPreferencesModelProcessor processor;

  private UserPreferencesModel model;


  @BeforeEach
  void setUp() {
    processor = new UserPreferencesModelProcessor();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = UserPreferencesModel.builder()
      .id(randomUUID())
      .darkMode(true)
      .contentLanguage("en")
      .user(UserPreferencesModel.PreferencesOwner.builder().id(randomUUID()).username(randomUUID()).build())
      .build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Nested
  class UserPreferencesTests {

    @BeforeEach
    void setUp() {
      authorityUtils.when(() -> AuthorityUtils.isCurrentUserId(model.getUser().getId())).thenReturn(false);
    }

    @Test
    void should_have_user_preferences_links() {
      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(SELF)).isPresent()
        .hasValueSatisfying(
          link -> assertThat(link.getHref()).isEqualTo(format("%s/%s", USER_PREFERENCES_PATH, model.getId())));
      assertThat(actual.getLink(USER_REL)).isPresent()
        .hasValueSatisfying(
          link -> assertThat(link.getHref()).isEqualTo(format("%s/%s", USER_PATH, model.getUser().getId())));
    }

    @Test
    void should_have_user_preferences_websocket_link() {
      authorityUtils.when(() -> AuthorityUtils.hasAnyAuthority(USER_PREFERENCES_READ, PROFILE_READ)).thenReturn(true);
      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getLinks()).hasSize(3);
      assertThat(actual.getLink(WEBSOCKET_REL)).isPresent()
        .hasValueSatisfying(
          link -> assertThat(link.getHref()).isEqualTo(format(USERS_PREFERENCES_CHANGED_CHANNEL, model.getId())));
    }

    @Test
    void should_have_user_preferences_default_affordance() {
      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(2)
        .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
        .extracting("name", "httpMethod")
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET));
    }

    @Test
    void should_have_update_affordance_if_user_has_user_preferences_update_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_PREFERENCES_UPDATE)).thenReturn(true);

      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
        .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
        .extracting("name", "httpMethod")
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET))
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains("update", HttpMethod.PATCH));
    }
  }

  @Nested
  class CurrentUserPreferencesTests {

    @BeforeEach
    void setUp() {
      authorityUtils.when(() -> AuthorityUtils.isCurrentUserId(model.getUser().getId())).thenReturn(true);
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_READ)).thenReturn(true);
    }

    @Test
    void should_have_current_user_preferences_link() {
      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(SELF)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES));
      assertThat(actual.getLink(CURRENT_USER_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(USER_PROFILE_PATH));
    }

    @Test
    void should_have_current_user_preferences_default_affordance() {
      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(2)
        .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
        .extracting("name", "httpMethod")
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains("getPreferences", HttpMethod.GET));
    }

    @Test
    void should_have_update_affordance_if_user_has_user_profile_update_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_UPDATE)).thenReturn(true);

      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
        .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
        .extracting("name", "httpMethod")
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains("getPreferences", HttpMethod.GET))
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains("updatePreferences", HttpMethod.PATCH));
    }
  }
}
