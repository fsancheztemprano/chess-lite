package dev.kurama.api.core.utility;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

import org.junit.jupiter.api.Test;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpMethod;

class HateoasUtilsTest {

  @Test
  void should_add_default_affordance_to_given_link() {
    Link actual = HateoasUtils.withDefaultAffordance(Link.of("/api"));

    assertThat(actual.getAffordances()).hasSize(1)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD));

  }
}
