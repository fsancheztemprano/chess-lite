package dev.kurama.api.core.configuration.development.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile({"development"})
@Configuration
public class SwaggerConfiguration {

  @Bean
  public OpenAPI springOpenAPI() {
    return new OpenAPI().info(new Info().title("Open API")
        .description("Application API")
        .version("v0.0.1")
        .license(new License().name("MIT").url("http://springdoc.org")))
      .externalDocs(new ExternalDocumentation().description("Application Wiki Documentation")
        .url("https://github.com/frango9000/fullstack-template"))
      .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
      .components(new Components().addSecuritySchemes("bearerAuth",
        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
  }
}
