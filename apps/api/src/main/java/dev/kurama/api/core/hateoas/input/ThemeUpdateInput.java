package dev.kurama.api.core.hateoas.input;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ThemeUpdateInput {

  private String primaryColor;
  private String accentColor;
  private String warnColor;

}
