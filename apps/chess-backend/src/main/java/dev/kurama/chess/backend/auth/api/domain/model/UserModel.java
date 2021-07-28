package dev.kurama.chess.backend.auth.api.domain.model;

import dev.kurama.chess.backend.core.api.domain.DomainModel;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
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
public class UserModel extends RepresentationModel<UserModel> implements DomainModel {

  private String id;
  private String firstname;
  private String lastname;
  private String username;
  private String email;
  @Column(length = 32768)
  private String profileImageUrl;
  private Date lastLoginDateDisplay;
  private Date joinDate;
  private String role;
  private List<String> authorities;
  private boolean active;
  private boolean locked;
  private boolean expired;
  private boolean credentialsExpired;
}
