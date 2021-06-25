package dev.kurama.chess.backend.auth.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Lists;
import dev.kurama.chess.backend.core.domain.AbstractEntity;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
@Data
@NoArgsConstructor
@Entity
public class User extends AbstractEntity implements Serializable {

  private String userId;
  private String firstName;
  private String lastName;
  private String username;
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;
  private String email;
  private String profileImageUrl;
  private Date lastLoginDate;
  private Date lastLoginDateDisplay;
  private Date joinDate;
  private String role;
  @ElementCollection
  private List<String> authorities = Lists.newArrayList();
  private boolean isActive;
  private boolean isLocked;
  private boolean isExpired;
  private boolean isCredentialsExpired;
}
