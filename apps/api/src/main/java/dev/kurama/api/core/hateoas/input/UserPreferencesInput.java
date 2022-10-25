package dev.kurama.api.core.hateoas.input;

import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
public class UserPreferencesInput {

  @Length(min = 2, max = 2)
  private String contentLanguage;

  private Boolean darkMode;
}
