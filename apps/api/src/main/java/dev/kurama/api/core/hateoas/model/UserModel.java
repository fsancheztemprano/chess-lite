package dev.kurama.api.core.hateoas.model;

import java.util.Date;
import java.util.List;
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
  private List<String> authorities;
  private boolean active;
  private boolean locked;
  private boolean expired;
  private boolean credentialsExpired;

  private String userPreferencesId;
}
