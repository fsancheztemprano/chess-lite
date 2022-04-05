package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.RoleAuthority.ROLE_DELETE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_READ;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_UPDATE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_UPDATE_CORE;
import static dev.kurama.api.core.constant.RestPathConstant.ROLE_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLES_REL;
import static dev.kurama.api.core.message.RoleChangedMessageSender.ROLE_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.http.HttpMethod;

class RoleModelProcessorTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private RoleModelProcessor processor;

  private RoleModel model;

  @BeforeEach
  void setUp() {
    processor = new RoleModelProcessor();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = RoleModel.builder().id(randomUUID()).name("TEST_ROLE").canLogin(false).coreRole(true).build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_have_links() {
    RoleModel actual = processor.process(model);

    assertThat(actual.getLinks()).hasSize(2);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(format("%s/%s", ROLE_PATH, model.getId())));
    assertThat(actual.getLink(ROLES_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).startsWith(ROLE_PATH));

  }

  @Test
  void should_have_websocket_link() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_READ)).thenReturn(true);
    RoleModel actual = processor.process(model);

    assertThat(actual.getLinks()).hasSize(3);
    assertThat(actual.getLink(WEBSOCKET_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(format(ROLE_CHANGED_CHANNEL, model.getId())));
  }

  @Test
  void should_have_default_affordance() {
    RoleModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(2)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET));
  }

  @Test
  void should_have_delete_affordance_if_user_has_role_delete_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_DELETE)).thenReturn(true);

    model.setCoreRole(false);

    RoleModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("delete", HttpMethod.DELETE));
  }


  @Test
  void should_have_update_affordance_if_user_has_role_update_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_READ)).thenReturn(true);

    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_UPDATE)).thenReturn(true);

    model.setCoreRole(false);

    RoleModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("update", HttpMethod.PATCH));
  }

  @Test
  void should_have_update_affordance_if_user_has_core_role_update_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_READ)).thenReturn(true);

    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_UPDATE_CORE)).thenReturn(true);

    model.setCoreRole(true);

    RoleModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("update", HttpMethod.PATCH));
  }
}
