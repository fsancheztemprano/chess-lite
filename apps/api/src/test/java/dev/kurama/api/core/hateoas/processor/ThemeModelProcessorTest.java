package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.ThemeAuthority.THEME_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.THEME_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

import dev.kurama.api.core.hateoas.model.ThemeModel;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.http.HttpMethod;

class ThemeModelProcessorTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private ThemeModelProcessor processor;

  private ThemeModel model;

  @BeforeEach
  void setUp() {
    processor = new ThemeModelProcessor();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);

    model = ThemeModel.builder().primaryColor(randomUUID()).warnColor(randomUUID()).build();
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Test
  void should_have_self_link() {
    ThemeModel actual = processor.process(this.model);

    assertThat(actual.getLinks()).hasSize(1);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(THEME_PATH));
  }

  @Test
  void should_have_default_affordance() {
    ThemeModel actual = processor.process(this.model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(2)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET));
  }

  @Test
  void should_have_update_affordance_if_user_has_global_setting_update_authority() {
    authorityUtils.when(() -> AuthorityUtils.hasAuthority(THEME_UPDATE)).thenReturn(true);

    ThemeModel actual = processor.process(this.model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("update", HttpMethod.PATCH));
  }
}
