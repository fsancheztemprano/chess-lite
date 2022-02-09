package dev.kurama.api.core.hateoas.root.processor;

import dev.kurama.api.core.hateoas.root.model.RootResource;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.jetbrains.annotations.Nullable;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.core.EmbeddedWrapper;
import org.springframework.http.HttpMethod;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;

import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_USER_MANAGEMENT_ROOT;
import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_READ;
import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_READ;
import static dev.kurama.api.core.authority.UserAuthority.USER_CREATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.constant.RestPathConstant.*;
import static dev.kurama.api.core.hateoas.relations.AdministrationRelations.*;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.*;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USERS_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_REL;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

class AdministrationRootResourceAssemblerTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private AdministrationRootResourceAssembler assembler;

  @BeforeEach
  void setUp() {
    assembler = new AdministrationRootResourceAssembler(new HateoasPageableHandlerMethodArgumentResolver());

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_have_self_and_root_links() {
    RepresentationModel<RootResource> actual = assembler.assemble();

    assertThat(actual.getLinks()).hasSize(2);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(ADMINISTRATION_ROOT_PATH));
    assertThat(actual.getLink(ROOT_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(BASE_PATH));
  }

  @Test
  void should_have_service_logs_link_with_service_logs_read_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(SERVICE_LOGS_READ))
      .thenReturn(true);

    RepresentationModel<RootResource> actual = assembler.assemble();

    assertThat(actual.getLinks()).hasSize(3);
    assertThat(actual.getLink(SERVICE_LOGS_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(SERVICE_LOGS_PATH));
  }

  @Test
  void should_have_global_settings_link_with_global_settings_read_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(GLOBAL_SETTINGS_READ))
      .thenReturn(true);

    RepresentationModel<RootResource> actual = assembler.assemble();

    assertThat(actual.getLinks()).hasSize(3);
    assertThat(actual.getLink(GLOBAL_SETTINGS_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(GLOBAL_SETTINGS_PATH));
  }

  @Nested
  class UserManagementEmbeddedTests {
    @BeforeEach
    void setUp() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(ADMIN_USER_MANAGEMENT_ROOT))
        .thenReturn(true);

    }

    @Test
    void should_have_user_management_resource_embedded() {
      RepresentationModel<RootResource> actual = assembler.assemble();

      ArrayList<EmbeddedWrapper> embeddeds = getEmbeddeds(actual);
      assertThat(embeddeds).hasSize(1);
      assertThat(embeddeds.get(0)
        .getRel()).isPresent()
        .isPresent()
        .hasValueSatisfying(link -> assertThat(link.value()).isEqualTo(USER_MANAGEMENT_ROOT_REL));

      RepresentationModel<?> embedded = (RepresentationModel<?>) embeddeds.get(0)
        .getValue();
      assertThat(embedded.getLinks()).hasSize(1);
      assertThat(embedded.getLink(SELF)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(ADMINISTRATION_ROOT_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(2)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD)));
    }

    @Test
    void should_have_user_management_resource_embedded_with_links_given_user_read_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_READ))
        .thenReturn(true);

      RepresentationModel<RootResource> actual = assembler.assemble();

      ArrayList<EmbeddedWrapper> embeddeds = getEmbeddeds(actual);

      RepresentationModel<?> embedded = (RepresentationModel<?>) embeddeds.get(0)
        .getValue();
      assertThat(embedded.getLinks()).hasSize(3);

      assertThat(embedded.getLink(SELF)).isPresent();

      assertThat(embedded.getLink(USER_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(USER_PATH + "/{userId}"))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(1));

      assertThat(embedded.getLink(USERS_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).startsWith(USER_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).isEmpty());

    }

    @Test
    void should_have_user_management_resource_embedded_with_create_affordance_given_user_create_authority() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_READ))
        .thenReturn(true);
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(USER_CREATE))
        .thenReturn(true);

      RepresentationModel<RootResource> actual = assembler.assemble();

      ArrayList<EmbeddedWrapper> embeddeds = getEmbeddeds(actual);

      RepresentationModel<?> embedded = (RepresentationModel<?>) embeddeds.get(0)
        .getValue();
      assertThat(embedded.getLinks()).hasSize(3);
      assertThat(embedded.getRequiredLink(USERS_REL)
        .getAffordances())
        .hasSize(1)
        .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
        .extracting("name", "httpMethod")
        .anySatisfy(reqs -> assertThat(reqs.toList()).contains("create", HttpMethod.POST));
    }

  }

  @Nullable
  private ArrayList<EmbeddedWrapper> getEmbeddeds(RepresentationModel<RootResource> actual) {
    return (ArrayList<EmbeddedWrapper>) ReflectionTestUtils.getField(actual, "embeddeds");
  }
}
