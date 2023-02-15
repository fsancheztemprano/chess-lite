package dev.kurama.api.core.hateoas.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ThemeModel extends RepresentationModel<ThemeModel> {

  private String primaryColor;
  private String accentColor;
  private String warnColor;
}
