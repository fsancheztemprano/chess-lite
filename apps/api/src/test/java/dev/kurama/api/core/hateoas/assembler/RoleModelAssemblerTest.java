package dev.kurama.api.core.hateoas.assembler;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_CREATE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_READ;
import static dev.kurama.api.core.constant.RestPathConstant.ROLE_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.message.RoleChangedMessageSender.ROLES_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.data.domain.PageRequest.of;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;
import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpMethod;
import org.springframework.web.util.UriComponents;

class RoleModelAssemblerTest {

  private RoleModelAssembler assembler;

  private MockedStatic<AuthorityUtils> authorityUtils;

  private static final UriComponents baseUri = fromUriString(ROLE_PATH).build();


  @BeforeEach
  void setUp() {
    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    assembler = new RoleModelAssembler();
    assembler.setPagedResourcesAssembler(
      new PagedResourcesAssembler<>(new HateoasPageableHandlerMethodArgumentResolver(), baseUri));
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_map_to_paged_model_and_add_links() {
    RoleModel admin = RoleModel.builder().id(randomUUID()).name("ADMIN").build();
    RoleModel mod = RoleModel.builder().id(randomUUID()).name("MOD").build();
    PageImpl<RoleModel> pagedRoles = new PageImpl<>(newArrayList(admin, mod), of(2, 2), 10);

    PagedModel<RoleModel> actual = assembler.toPagedModel(pagedRoles);

    assertThat(actual.getContent()).hasSize(2)
      .extracting("id")
      .anySatisfy(id -> assertThat(id).isEqualTo(admin.getId()))
      .anySatisfy(id -> assertThat(id).isEqualTo(mod.getId()));
    assertThat(actual.getLinks()).hasSize(5);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).startsWith(baseUri.toString()));

    assertThat(actual.getLinks()).extracting("rel")
      .anySatisfy(name -> assertThat(name).hasToString("first"))
      .anySatisfy(name -> assertThat(name).hasToString("last"))
      .anySatisfy(name -> assertThat(name).hasToString("prev"))
      .anySatisfy(name -> assertThat(name).hasToString("next"));
  }

  @Test
  void should_add_websocket_link_if_user_has_role_read_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_READ)).thenReturn(true);
    PageImpl<RoleModel> pagedRoles = new PageImpl<>(newArrayList(), of(0, 1), 0);

    PagedModel<RoleModel> actual = assembler.toPagedModel(pagedRoles);

    assertThat(actual.getLinks()).hasSize(2);
    assertThat(actual.getLink(WEBSOCKET_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(ROLES_CHANGED_CHANNEL));
  }

  @Test
  void should_add_default_affordance() {
    PageImpl<RoleModel> pagedRoles = new PageImpl<>(newArrayList(), of(0, 1), 0);

    PagedModel<RoleModel> actual = assembler.toPagedModel(pagedRoles);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(1)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD));
  }

  @Test
  void should_add_create_affordance_if_user_has_role_create_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(ROLE_CREATE)).thenReturn(true);

    PageImpl<RoleModel> pagedRoles = new PageImpl<>(newArrayList(), of(0, 1), 0);

    PagedModel<RoleModel> actual = assembler.toPagedModel(pagedRoles);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(2)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("create", HttpMethod.POST));
  }
}
