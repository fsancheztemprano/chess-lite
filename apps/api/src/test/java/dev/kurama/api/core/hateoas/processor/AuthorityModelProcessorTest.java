package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.AuthorityAuthority.AUTHORITY_READ;
import static dev.kurama.api.core.constant.RestPathConstant.AUTHORITY_PATH;
import static dev.kurama.api.core.hateoas.relations.AuthorityRelations.AUTHORITIES_REL;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

import dev.kurama.api.core.hateoas.model.AuthorityModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.http.HttpMethod;

class AuthorityModelProcessorTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private AuthorityModelProcessor processor;

  private AuthorityModel model;

  @BeforeEach
  void setUp() {
    processor = new AuthorityModelProcessor();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = AuthorityModel.builder().id(randomUUID()).name(randomAlphanumeric(8)).build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_not_have_links_if_user_does_not_have_authority_read_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(AUTHORITY_READ)).thenReturn(false);

    assertThat(processor.process(model).getLink(SELF)).isEmpty();
  }

  @Test
  void should_have_links_if_user_has_authority_read_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(AUTHORITY_READ)).thenReturn(true);

    AuthorityModel actual = processor.process(model);

    assertThat(actual.getLinks()).hasSize(2);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(format("%s/%s", AUTHORITY_PATH, model.getId())));
    assertThat(actual.getLink(AUTHORITIES_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(AUTHORITY_PATH));
  }

  @Test
  void should_have_default_affordance() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(AUTHORITY_READ)).thenReturn(true);

    AuthorityModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(2)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET));


  }
}
