package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.*;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.UserRelations.CURRENT_USER_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_REL;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_PREFERENCES;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

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
                                .user(UserPreferencesModel.PreferencesOwner.builder()
                                                                           .id(randomUUID())
                                                                           .username(randomUUID())
                                                                           .build())
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
      authorityUtils.when(() -> AuthorityUtils.isCurrentUsername(model.getUser()
                                                                      .getUsername()))
                    .thenReturn(false);
    }

    @Test
    void should_have_self_link() {
      UserPreferencesModel actual = processor.process(model);
      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(SELF)).isPresent()
                                      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                        format("%s/%s", USER_PREFERENCES_PATH, model.getId())));
      assertThat(actual.getLink(USER_REL)).isPresent()
                                          .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                            format("%s/%s", USER_PATH, model.getUser()
                                                                            .getId())));

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(2)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo(DEFAULT))
                                         .anySatisfy(name -> assertThat(name).isEqualTo("get"));

    }

    @Test
    void should_have_update_template_if_user_has_user_preferences_update_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_PREFERENCES_UPDATE))
                    .thenReturn(true);

      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(3)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("update"));
    }
  }

  @Nested
  class CurrentUserPreferencesTests {
    @BeforeEach
    void setUp() {
      authorityUtils.when(() -> AuthorityUtils.isCurrentUsername(model.getUser()
                                                                      .getUsername()))
                    .thenReturn(true);
    }

    @Test
    void should_show_current_user_preferences_link() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_READ))
                    .thenReturn(true);
      UserPreferencesModel actual = processor.process(model);
      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(SELF)).isPresent()
                                      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                        USER_PROFILE_PATH + USER_PROFILE_PREFERENCES));
      assertThat(actual.getLink(CURRENT_USER_REL)).isPresent()
                                                  .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                                    USER_PROFILE_PATH));

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(2)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo(DEFAULT))
                                         .anySatisfy(name -> assertThat(name).isEqualTo("getPreferences"));
    }


    @Test
    void should_have_update_template_if_user_has_user_profile_update_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_UPDATE))
                    .thenReturn(true);

      UserPreferencesModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(3)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("updatePreferences"));
    }
  }
}
