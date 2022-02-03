package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.AuthorityModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import static dev.kurama.api.core.authority.AuthorityAuthority.AUTHORITY_READ;
import static dev.kurama.api.core.constant.RestPathConstant.AUTHORITY_PATH;
import static dev.kurama.api.core.hateoas.relations.AuthorityRelations.AUTHORITIES_REL;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

class AuthorityModelProcessorTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private AuthorityModelProcessor processor;

  private AuthorityModel model;

  @BeforeEach
  void setUp() {
    processor = new AuthorityModelProcessor();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = AuthorityModel.builder()
                          .id(randomUUID())
                          .name("TEST_AUTH")
                          .build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_not_have_links_if_user_does_not_have_authority_read_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(AUTHORITY_READ))
                  .thenReturn(false);

    assertThat(processor.process(model)
                        .getLink(SELF)).isEmpty();
  }

  @Test
  void should_have_links_if_user_has_authority_read_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(AUTHORITY_READ))
                  .thenReturn(true);

    AuthorityModel actual = processor.process(this.model);
    assertThat(actual.getLinks()).hasSize(2);
    assertThat(actual.getLink(SELF)).isPresent()
                                    .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
                                      format("%s/%s", AUTHORITY_PATH, model.getId())));
    assertThat(actual.getLink(AUTHORITIES_REL)).isPresent()
                                               .hasValueSatisfying(
                                                 link -> assertThat(link.getHref()).isEqualTo(AUTHORITY_PATH));

    assertThat(actual.getRequiredLink(SELF)
                     .getAffordances()).hasSize(2)
                                       .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
                                       .extracting("name")
                                       .anySatisfy(name -> assertThat(name).isEqualTo(DEFAULT))
                                       .anySatisfy(name -> assertThat(name).isEqualTo("get"));
  }
}
