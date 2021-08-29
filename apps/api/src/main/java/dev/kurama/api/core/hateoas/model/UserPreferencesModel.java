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
public class UserPreferencesModel extends RepresentationModel<UserPreferencesModel> {

  private String id;
  private boolean darkMode;
  private String contentLanguage;

  private PreferencesOwner user;

  @Data
  public static class PreferencesOwner {

    private String id;
    private String username;

  }
}
