package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static dev.kurama.api.core.authority.UserAuthority.*;
import static dev.kurama.api.core.constant.RestPathConstant.*;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USERS_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_PREFERENCES_REL;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_PREFERENCES;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

@ExtendWith(MockitoExtension.class)
class UserModelProcessorTest {
  private MockedStatic<AuthorityUtils> authorityUtils;

  @InjectMocks
  private UserModelProcessor processor;

  @Mock
  private UserPreferencesModelProcessor userPreferencesModelProcessor;

  private UserModel model;

  @BeforeEach
  void setUp() {
    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = UserModel.builder()
                     .id(randomUUID())
                     .username(randomUUID())
                     .userPreferences(UserPreferencesModel.builder()
                                                          .id(randomUUID())
                                                          .build())
                     .build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Nested
  class UserModelTests {
    @BeforeEach
    void setUp() {
      authorityUtils.when(() -> AuthorityUtils.isCurrentUsername(model.getUsername()))
                    .thenReturn(false);
    }

    @Test
    void should_have_links() {
      UserModel actual = processor.process(model);

      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(SELF)).isPresent()
                                      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                        format("%s/%s", USER_PATH, model.getId())));
      assertThat(actual.getLink(USER_PREFERENCES_REL)).isPresent()
                                                      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                                        format("%s/%s", USER_PREFERENCES_PATH, model.getUserPreferences()
                                                                                                    .getId())));
      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(2)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo(DEFAULT))
                                         .anySatisfy(name -> assertThat(name).isEqualTo("get"));
    }

    @Test
    void should_have_link_to_all_users_if_user_has_user_read_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_READ))
                    .thenReturn(true);

      UserModel actual = processor.process(model);

      assertThat(actual.getLinks()).hasSize(3);
      assertThat(actual.getLink(USERS_REL)).isPresent()
                                           .hasValueSatisfying(link -> assertThat(link.getHref())
                                             .startsWith(USER_PATH));
    }

    @Test
    void should_have_template_to_delete_user_if_user_has_user_delete_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_DELETE))
                    .thenReturn(true);

      UserModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(3)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("delete"));
    }

    @Test
    void should_have_template_to_update_user_if_user_has_user_update_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_UPDATE))
                    .thenReturn(true);

      UserModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(4)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("update"))
                                         .anySatisfy(name -> assertThat(name).isEqualTo("requestActivationToken"));
    }

    @Test
    void should_have_template_to_update_users_role_if_user_has_user_update_role_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_UPDATE_ROLE))
                    .thenReturn(true);

      UserModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(3)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("updateRole"));
    }

    @Test
    void should_have_template_to_update_users_authorities_if_user_has_user_update_authorities_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_UPDATE_AUTHORITIES))
                    .thenReturn(true);

      UserModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(3)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("updateAuthorities"));
    }
  }

  @Nested
  class CurrentUserModelTests {
    @BeforeEach
    void setUp() {
      authorityUtils.when(() -> AuthorityUtils.isCurrentUsername(model.getUsername()))
                    .thenReturn(true);
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_READ))
                    .thenReturn(true);
    }

    @Test
    void should_have_current_users_links() {
      UserModel actual = processor.process(model);

      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(SELF)).isPresent()
                                      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                        USER_PROFILE_PATH));
      assertThat(actual.getLink(USER_PREFERENCES_REL)).isPresent()
                                                      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                                        USER_PROFILE_PATH + USER_PROFILE_PREFERENCES));

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(2)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo(DEFAULT))
                                         .anySatisfy(name -> assertThat(name).isEqualTo("get"));
    }


    @Test
    void should_have_templates_to_update_profile_if_user_has_profile_update_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_UPDATE))
                    .thenReturn(true);

      UserModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(5)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("updateProfile"))
                                         .anySatisfy(name -> assertThat(name).isEqualTo("changePassword"))
                                         .anySatisfy(name -> assertThat(name).isEqualTo("uploadAvatar"))
      ;
    }

    @Test
    void should_have_template_to_delete_profile_if_user_has_profile_delete_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_DELETE))
                    .thenReturn(true);

      UserModel actual = processor.process(model);

      assertThat(actual.getRequiredLink(SELF)
                       .getAffordances()).hasSize(3)
                                         .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                         .extracting("name")
                                         .anySatisfy(name -> assertThat(name).isEqualTo("deleteProfile"))
      ;
    }
  }
}
