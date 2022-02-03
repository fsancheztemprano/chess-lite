package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.GLOBAL_SETTINGS_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

class GlobalSettingsModelProcessorTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private GlobalSettingsModelProcessor processor;

  private GlobalSettingsModel model;

  @BeforeEach
  void setUp() {
    processor = new GlobalSettingsModelProcessor();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = GlobalSettingsModel.builder()
                               .signupOpen(false)
                               .defaultRole(RoleModel.builder()
                                                     .id(randomUUID())
                                                     .build())
                               .build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_have_links() {
    GlobalSettingsModel actual = processor.process(this.model);
    assertThat(actual.getLinks()).hasSize(1);
    assertThat(actual.getLink(SELF)).isPresent()
                                    .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                      GLOBAL_SETTINGS_PATH));

    assertThat(actual.getRequiredLink(SELF)
                     .getAffordances()).hasSize(2)
                                       .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                       .extracting("name")
                                       .anySatisfy(name -> assertThat(name).isEqualTo(DEFAULT))
                                       .anySatisfy(name -> assertThat(name).isEqualTo("get"));
  }


  @Test
  void should_have_update_template_if_user_has_global_Setting_update_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(GLOBAL_SETTINGS_UPDATE))
                  .thenReturn(true);

    GlobalSettingsModel actual = processor.process(this.model);

    assertThat(actual.getRequiredLink(SELF)
                     .getAffordances()).hasSize(3)
                                       .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                       .extracting("name")
                                       .anySatisfy(name -> assertThat(name).isEqualTo("update"));

  }
}
