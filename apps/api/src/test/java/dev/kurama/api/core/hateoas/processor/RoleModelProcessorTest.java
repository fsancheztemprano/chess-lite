package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import static dev.kurama.api.core.authority.RoleAuthority.*;
import static dev.kurama.api.core.constant.RestPathConstant.ROLE_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLES_REL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

class RoleModelProcessorTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private RoleModelProcessor processor;

  private RoleModel model;

  @BeforeEach
  void setUp() {
    processor = new RoleModelProcessor();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = RoleModel.builder()
                     .id(randomUUID())
                     .name("TEST_ROLE")
                     .canLogin(false)
                     .coreRole(true)
                     .build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_have_links() {
    RoleModel actual = processor.process(this.model);
    assertThat(actual.getLinks()).hasSize(2);
    assertThat(actual.getLink(SELF)).isPresent()
                                    .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                      format("%s/%s", ROLE_PATH, model.getId())));
    assertThat(actual.getLink(ROLES_REL)).isPresent()
                                         .hasValueSatisfying(link -> assertThat(link.getHref()).startsWith(ROLE_PATH));

    assertThat(actual.getRequiredLink(SELF)
                     .getAffordances()).hasSize(2)
                                       .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                       .extracting("name")
                                       .anySatisfy(name -> assertThat(name).isEqualTo(DEFAULT))
                                       .anySatisfy(name -> assertThat(name).isEqualTo("get"));
  }


  @Test
  void should_have_delete_template_if_user_has_role_delete_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_DELETE))
                  .thenReturn(true);

    this.model.setCoreRole(false);

    RoleModel actual = processor.process(this.model);

    assertThat(actual.getRequiredLink(SELF)
                     .getAffordances()).hasSize(3)
                                       .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                       .extracting("name")

                                       .anySatisfy(name -> assertThat(name).isEqualTo("delete"));

  }


  @Test
  void should_have_update_template_if_user_has_role_update_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_READ))
                  .thenReturn(true);

    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_UPDATE))
                  .thenReturn(true);

    this.model.setCoreRole(false);

    RoleModel actual = processor.process(this.model);

    assertThat(actual.getRequiredLink(SELF)
                     .getAffordances()).hasSize(3)
                                       .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                       .extracting("name")
                                       .anySatisfy(name -> assertThat(name).isEqualTo("update"));

  }

  @Test
  void should_have_update_template_if_user_has_core_role_update_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_READ))
                  .thenReturn(true);

    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_UPDATE_CORE))
                  .thenReturn(true);

    this.model.setCoreRole(true);

    RoleModel actual = processor.process(this.model);

    assertThat(actual.getRequiredLink(SELF)
                     .getAffordances()).hasSize(3)
                                       .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                       .extracting("name")
                                       .anySatisfy(name -> assertThat(name).isEqualTo("update"));

  }
}
