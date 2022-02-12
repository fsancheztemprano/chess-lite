package dev.kurama.api.core.configuration.development.swagger;

import io.swagger.v3.oas.models.OpenAPI;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;


class SwaggerConfigurationTest {
  @Test
  void should_configure_swagger_configuration() {
    SwaggerConfiguration configuration = new SwaggerConfiguration();

    OpenAPI openAPI = configuration.springOpenAPI();

    assertThat(openAPI).isNotNull();
  }
}
