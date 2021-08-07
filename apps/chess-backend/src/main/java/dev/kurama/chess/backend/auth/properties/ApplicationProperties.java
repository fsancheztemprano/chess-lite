package dev.kurama.chess.backend.auth.properties;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "application")
public class ApplicationProperties {

  private String[] publicUrls;

  @NotNull
  private Jwt jwt;

  @Data
  public static class Jwt {

    @NotBlank
    private String secret;
  }
}
