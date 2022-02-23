package dev.kurama.api.core.hateoas.assembler;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.constant.RestPathConstant.AUTHORITY_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.data.domain.PageRequest.of;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;
import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

import dev.kurama.api.core.hateoas.model.AuthorityModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpMethod;
import org.springframework.web.util.UriComponents;

class AuthorityModelAssemblerTest {

  private AuthorityModelAssembler assembler;

  private static final UriComponents baseUri = fromUriString(AUTHORITY_PATH).build();


  @BeforeEach
  void setUp() {
    assembler = new AuthorityModelAssembler();
    assembler.setPagedResourcesAssembler(
      new PagedResourcesAssembler<>(new HateoasPageableHandlerMethodArgumentResolver(), baseUri));
  }

  @Test
  void should_map_to_paged_model_and_add_links() {
    AuthorityModel admin = AuthorityModel.builder().id(randomUUID()).name("ADMIN").build();
    AuthorityModel mod = AuthorityModel.builder().id(randomUUID()).name("MOD").build();
    PageImpl<AuthorityModel> pagedAuthorities = new PageImpl<>(newArrayList(admin, mod), of(2, 2), 10);

    PagedModel<AuthorityModel> actual = assembler.toPagedModel(pagedAuthorities);

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
  void should_map_to_paged_model_and_add_affordances() {
    PageImpl<AuthorityModel> pagedAuthorities = new PageImpl<>(newArrayList(), of(0, 1), 0);

    PagedModel<AuthorityModel> actual = assembler.toPagedModel(pagedAuthorities);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(1)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD));
  }
}
