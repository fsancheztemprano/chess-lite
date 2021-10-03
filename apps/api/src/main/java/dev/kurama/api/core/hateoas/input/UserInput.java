package dev.kurama.api.core.hateoas.input;

import java.util.Set;
import javax.validation.constraints.Email;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Builder
@Data
public class UserInput {

  @Length(min = 5, max = 128)
  private String username;
  @Length(min = 6, max = 128)
  private String password;
  private String firstname;
  private String lastname;
  @Email
  private String email;
  private String profileImageUrl;
  private String roleId;
  private Boolean active;
  private Boolean locked;
  private Boolean expired;
  private Boolean credentialsExpired;
  private Set<String> authorityIds;
}
