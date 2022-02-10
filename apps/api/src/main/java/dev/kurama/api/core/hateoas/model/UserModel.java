package dev.kurama.api.core.hateoas.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.util.Date;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserModel extends RepresentationModel<UserModel> {

  private String id;
  private String firstname;
  private String lastname;
  private String username;
  private String email;
  private String profileImageUrl;
  private Date lastLoginDateDisplay;
  private Date joinDate;
  private RoleModel role;
  private Set<AuthorityModel> authorities;
  private boolean active;
  private boolean locked;
  private boolean expired;
  private boolean credentialsExpired;

  private UserPreferencesModel userPreferences;
}
